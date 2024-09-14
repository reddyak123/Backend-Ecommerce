const { Pool } = require('pg');
require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};