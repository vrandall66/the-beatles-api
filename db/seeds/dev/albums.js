const albumsData = require('../../../albumsData.js');
const songsData = require('../../../songsData.js');

const createAlbum = (knex, album) => {
  return knex('albums').insert(
    {
      albumId: album.collectionId,
      albumName: album.collectionName,
      trackCount: album.trackCount,
      releaseDate: album.releaseDate,
      genre: album.primaryGenreName
    },
    'id'
  );
};

const createSong = (knex, song) => {
  return knex('songs').insert(
    {
      trackName: song.trackName,
      albumId: song.collectionId,
      albumName: song.albumName,
      discNumber: song.discNumber,
      trackNumber: song.trackNumber,
      trackTimeMillis: song.trackTimeMillis
    },
    'id'
  );
};

exports.seed = function(knex) {
  return knex('songs')
    .del()
    .then(() => {
      const promisedSongs = [];
      songsData.forEach(song => {
        promisedSongs.push(createSong(knex, song));
      });
      return Promise.all(promisedSongs);
    })
    .then(() => knex('albums').del())
    .then(() => {
      const promisedAlbums = [];
      albumsData.forEach(album => {
        promisedAlbums.push(createAlbum(knex, album));
      });
      return Promise.all(promisedAlbums);
    })
    .catch(err => console.log(`Error seeding data: ${err}`));
};
