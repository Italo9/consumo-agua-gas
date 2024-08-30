require('dotenv').config();

module.exports = {
  migrations: {
    directory: './migrations'
  },
  driver: 'pg',
  connection: {
    host: process.env.DB_HOST, // 'db'
    user: process.env.DB_USER, // 'postgres'
    password: process.env.DB_PASSWORD, // '123456'
    database: process.env.DB_DATABASE, // 'consumo_agua_gas'
    port: process.env.DB_PORT // 5432
  }
};
