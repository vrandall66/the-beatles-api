const express = require('express');
const cors = require('cors');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const path = require('path');

app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.locals.title = 'The Beatles api';

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/v1/albums', (request, response) => {
  database('albums')
    .select()
    .then(albums => {
      response.status(200).json(albums);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/albums/:id', (request, response) => {
  const { id } = request.params;
  database('albums')
    .where({ albumId: id })
    .then(album => {
      if (album.length === 0) {
        response
          .status(404)
          .json({ error: `There is not an album with the id of ${id}` });
      }
      response.status(200).json(album[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/songs', (request, response) => {
  database('songs')
    .select()
    .then(songs => {
      response.status(200).json(songs);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/songs/:id', (request, response) => {
  const { id } = request.params;
  database('songs')
    .where({ trackId: id })
    .then(song => {
      if (song.length === 0) {
        response
          .status(404)
          .json({ error: `There is not a song with the id of ${id}` });
      }
      response.status(200).json(song[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/albums', (request, response) => {
  const album = request.body;
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
