const albumsData = require('../../../albumsData.js');
const songsData = require('../../../songsData.js');

const createAlbum = (knex, album) => {
  return knex('albums').insert(
    {
      albumId: album.collectionId,
      albumName: album.collectionName,
      genre: album.primaryGenreName,
      releaseDate: album.releaseDate,
      trackCount: album.trackCount
    },
    'id'
  );
};

const createSong = (knex, song) => {
  return knex('songs').insert(
    {
      album: song.collectionId,
      albumName: song.albumName,
      discNumber: song.discNumber,
      trackId: song.trackId,
      trackName: song.trackName,
      trackNumber: song.trackNumber,
      trackTimeMillis: song.trackTimeMillis
    },
    'id'
  );
};

exports.seed = function(knex) {
  return knex('albums')
    .del()
    .then(() => {
      const promisedAlbums = [];
      albumsData.forEach(album => {
        promisedAlbums.push(createAlbum(knex, album));
      });
      return Promise.all(promisedAlbums);
    })
    .then(() => knex('songs').del())
    .then(() => {
      const promisedSongs = [];
      songsData.forEach(song => {
        promisedSongs.push(createSong(knex, song));
      });
      return Promise.all(promisedSongs);
    })
    .catch(err => console.log(`Error seeding data: ${err}`));
};
