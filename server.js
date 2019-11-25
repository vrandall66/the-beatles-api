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
  // When a user visits /api/v1/albums using a GET request,
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
  // When a user visits the /api/v1/albums/:id using a GET request,
  const { id } = request.params;
  // destructuring the id key out of the params object
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
  // When a user visits /api/v1/songs using a GET request,
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
  // When a user visits the /api/v1/songs/:id using a GET request,
  const { id } = request.params;
  // Destructuring the id key out of the params object
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
  const album = request.body;
  const { albumName, genre, releaseDate, trackCount } = album;
  for (let key of ['albumName', 'genre', 'releaseDate', 'trackCount']) {
    if (!album[key]) {
      return response
        .status(422)
        .send({ error: `POST failed, missing required key: ${key}` });
    }
  }
  database('albums')
    .insert(album, 'id')
    .then(id => response.status(201).json({ albumId: id[0], ...album }))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/songs', (request, response) => {
  const song = request.body;
  const {
    album,
    albumName,
    discNumber,
    trackId,
    trackName,
    trackNumber,
    trackTimeMillis
  } = song;
  for (let key of [
    'album',
    'albumName',
    'discNumber',
    'trackId',
    'trackName',
    'trackNumber',
    'trackTimeMillis'
  ]) {
    if (!song[key]) {
      return response
        .status(422)
        .send({ error: `POST failed, missing required key: ${key}` });
    }
  }
  database('songs')
    .insert(song, 'id')
    .then(id => response.status(201).json({ trackId: id[0], ...song }))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/albums/:id', (request, response) => {
  const { id } = request.params;
  database('albums')
    .where({ albumId: id })
    .select()
    .del()
    .then(results => {
      if (results === 0) {
        response.status(404).json(`No album found with the id of ${id}`);
      }
      response.status(200).json(`Album ${id} sucessfully deleted.`);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

app.delete('/api/v1/songs/:id', (request, response) => {
  const { id } = request.params;
  database('songs')
    .where({ trackId: id })
    .select()
    .del()
    .then(results => {
      if (results === 0) {
        response.status(404).json(`No song found with the id of ${id}`);
      }
      response.status(200).json(`Song ${id} sucessfully deleted.`);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get('port')}`
  );
});
