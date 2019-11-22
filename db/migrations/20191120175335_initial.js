exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('albums', function(table) {
      table.increments('id').primary();
      table.string('albumId');
      table.string('albumName');
      table.string('trackCount');
      table.string('releaseDate');
      table.string('genre');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('trackName');
      table.string('albumId');
      table.string('albumName');
      table.string('discNumber');
      table.string('trackNumber');
      table.string('trackTimeMillis');

      // table.integer('albumId').unsigned();
      // table.foreign('albumId').references('albums.albumId');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('songs'),
    knex.schema.dropTable('albums')
  ]);
};
