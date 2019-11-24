exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('albums', function(table) {
      table.increments('id').primary();
      table.integer('albumId');
      table.unique('albumId');
      table.string('albumName');
      table.string('genre');
      table.string('releaseDate');
      table.integer('trackCount');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('albumName');
      table.integer('discNumber');
      table.integer('trackId');
      table.string('trackName');
      table.integer('trackNumber');
      table.integer('trackTimeMillis');
      table.integer('album').unsigned();
      table.foreign('album').references('albums.albumId');

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
