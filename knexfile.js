module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/beatles',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
