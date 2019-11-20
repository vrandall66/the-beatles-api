exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('albums', function(table) {
      table.increments('id').primary();
      table.string('album_id');
      table.string('album_name');
      table.string('track_count');
      table.string('release_date');
      table.string('genre');
      table.string('collection_id');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('track_name');
      table.string('album_name');
      table.string('disc_number');
      table.string('track_number');
      table.string('collection_id');

      table.integer('album_id').unsigned();
      table.foreign('album_id').references('albums.id');

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
