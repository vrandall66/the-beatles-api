const express = require('express');
// requiring the installed web framework for Node.js
const cors = require('cors');
// requiring cross-origin resource sharing for security: prevents api calls from other domains
const app = express();
// create app by calling express
const environment = process.env.NODE_ENV || 'development';
// distinguishes which Node environment the server is in, defaults to development
const configuration = require('./knexfile')[environment];
// requires the JS query builder for PostgreSQL and determines settings based upon the environment
const database = require('knex')(configuration);
// Determines the database based upon the just determined environment

app.use(cors());
// Would get a cors error if a request was made from another domain
app.use(express.json());
// App will now parse the request body to JSON by default
app.set('port', process.env.PORT || 3000);
// Sets the default port to 3000, or whichever port is specified by the user
app.locals.title = 'The Beatles api';
// Assigns the title of the app

app.get('/', (request, response) => {
  // while at the home route
  response.send(
    // The application should respond with some simple HTML to briefly guide the user through the simplest interactions with the database, not as detailed as the README
    '<h1>Welcome to The Beatles API!</h1>' +
      '<h3>To get all albums (including anniversary albums):</h3>' +
      '<p>Go to: /api/v1/albums</p>' +
      '<h3>To get all songs (currently available on the database):</h3>' +
      '<p>Go to: /api/v1/songs</p>' +
      '<h3>To get an album by albumId:</h3>' +
      '<p>Go to: /api/v1/albums/:albumId</p>' +
      '<h3>To get a song by trackId:</h3>' +
      '<p>Go to: /api/v1/songs/:trackId</p>'
  );
  // In a future iteration, this database will have a UI. I promise.
});

app.get('/api/v1/albums', (request, response) => {
  // When a user visits /api/v1/albums endpoint using a GET request,
  database('albums')
    // Go to the albums table
    .select()
    // Grab all albums from the table
    .then(albums => {
      response.status(200).json(albums);
    })
    // Send a successful response status code and display all albums in json format
    .catch(error => {
      response.status(500).json({ error });
    });
  // Send a failed response status code and json the error response
});

app.get('/api/v1/albums/:id', (request, response) => {
  // When a user visits the /api/v1/albums/:id endpoint using a GET request,
  const { id } = request.params;
  // destructuring the id out of the params
  database('albums')
    // Go to the albums table
    .where({ albumId: id })
    // find the albumId that matches the id from the request body
    .then(album => {
      if (album.length === 0) {
        response.status(404).json({
          error: `There is not an album with the id of ${id}`
        });
      }
      // If the length of the array is 0, send an error response status code and a string of "There is not an album with the id of id"
      response.status(200).json(album[0]);
      // Send a successful status code and display the album from the response array at index 0 in json format
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  // Send a failed response status code and json the error response
});

app.get('/api/v1/songs', (request, response) => {
  // When a user visits /api/v1/songs endpoint using a GET request,
  database('songs')
    // Go to the songs table
    .select()
    // Grab all songs from the table
    .then(songs => {
      response.status(200).json(songs);
    })
    // Send a successful response status code and display all songs available in json format
    .catch(error => {
      response.status(500).json({ error });
    });
  // Send a failed response status code and json the error response
});

app.get('/api/v1/songs/:id', (request, response) => {
  // When a user visits the /api/v1/songs/:id endpoint using a GET request,
  const { id } = request.params;
  // Destructuring the id out of the params
  database('songs')
    // Go to the songs table
    .where({ trackId: id })
    // Find the trackId that matches the id from the request body
    .then(song => {
      if (song.length === 0) {
        response.status(404).json({
          error: `There is not a song with the id of ${id}`
        });
      }
      // If the length of the array is 0, send an error response status code and a string of "There is not a song with the id of id"
      response.status(200).json(song[0]);
      // Send a successful status code and display the song from the response array at index 0 in json format
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  // Send a failed response status code and json the error response
});

app.post('/api/v1/albums', (request, response) => {
  // When a user visits the /api/v1/albums endpoint using a POST request,
  const album = request.body;
  // Destructuring album from the request body
  for (let key of ['albumName', 'genre', 'releaseDate', 'trackCount']) {
    // iterate through keys of the album request
    if (!album[key]) {
      return response.status(422).send({
        error: `POST failed, missing required key: ${key}`
      });
    }
    // If there is a missing key for the POST request, send an unsuccessful response status code and a string of "POST failed, missing required key: key"
  }
  database('albums')
    // Go to the albums table
    .insert(album, 'id')
    // Add the new album, increment another id for that album on the table
    .then(id => response.status(201).json({ albumId: id[0], ...album }))
    // Send a successful status code and display the new album from the response array at index 0 in json format
    .catch(error => response.status(500).json({ error }));
  // Send a failed response status code and json the error response
});

app.post('/api/v1/songs', (request, response) => {
  // When a user visits the /api/v1/songs endpoint using a POST request,
  const song = request.body;
  // Destructuring the song from the request body
  for (let key of [
    'album',
    'albumName',
    'discNumber',
    'trackId',
    'trackName',
    'trackNumber',
    'trackTimeMillis'
    // iterate through keys of the song request
  ]) {
    if (!song[key]) {
      return response
        .status(422)
        .send({ error: `POST failed, missing required key: ${key}` });
    }
    // If there is a missing key for the POST request, send an unsuccessful response status code and a string of "POST failed, missing required key: key"
  }
  database('songs')
    // Go to the songs table
    .insert(song, 'id')
    // Add the new song, increment another id for that song on the table
    .then(id => response.status(201).json({ trackId: id[0], ...song }))
    // Send a successful status code and display the new album from the response array at index 0 in json format
    .catch(error => response.status(500).json({ error }));
  // Send a failed response status code and json the error response
});

app.delete('/api/v1/albums/:id', (request, response) => {
  // When a user visits the /api/v1/albums/:id endpoint using a DELETE request,
  const { id } = request.params;
  // Destructuring the id from the request params
  database('albums')
    // Go to the albums table
    .where({ albumId: id })
    // Find the albumId that matches the id from the request
    .select()
    // Grab that album
    .del()
    // Delete that album from the albums table
    .then(results => {
      if (results === 0) {
        response.status(404).json(`No album found with the id of ${id}`);
      }
      // If there is not an album with a matching id, send an unsuccessful response status code with the string of "No album found with the id of id"
      response.status(200).json(`Album ${id} sucessfully deleted.`);
    })
    // Send a successful status code with the string of "Album id sucessfully deleted."
    .catch(error => {
      response.status(404).json({ error });
    });
  // Send an unsuccessful status code with the error in json format
});

app.delete('/api/v1/songs/:id', (request, response) => {
  // Whena  user visits the /api/v1/songs/:id endpoint using a DELETE request,
  const { id } = request.params;
  // Destructuring the id from the request params
  database('songs')
    // Go to the songs table
    .where({ trackId: id })
    // Find the trackId that matches the id from the request
    .select()
    // Grab that song
    .del()
    // Delete that song from the songs table
    .then(results => {
      if (results === 0) {
        response.status(404).json(`No song found with the id of ${id}`);
      }
      // If there is not a song with a matching id, send an unsuccessful response status code with the string of "No song found with the id of id"
      response.status(200).json(`Song ${id} sucessfully deleted.`);
    })
    // Send a successful status code with the string of "Song id successfully deleted."
    .catch(error => {
      response.status(404).json({ error });
    });
  // Send an unsuccessful status code with the error in json format
});

app.listen(app.get('port'), () => {
  // When the app port is up and running
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get('port')}`
  );
  // Console log the name of the app and the port it is currently locally running on
});
