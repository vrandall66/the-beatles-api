const express = require('express');
const cors = require('cors');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.locals.title = 'The Beatles api';

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

app.listen(app.get('port'), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get('port')}`
  );
});
