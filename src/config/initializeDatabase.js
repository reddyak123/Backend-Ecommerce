const db = require('./db');
const createUsersTable = require('./tables/createUsersTable');
const createProductsTable = require('./tables/createProductsTable');
const createCartTable = require('./tables/createCartTable');

const initializeDatabase = async () => {
  console.log('BEGIN DB MIGRATION');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN'); // begin transaction
    await client.query(createUsersTable);
    await client.query(createProductsTable);
    await client.query(createCartTable);
    await client.query('COMMIT'); // commit transaction
    console.log('END DB MIGRATION');
  } catch (e) {
    await client.query('ROLLBACK'); // rollback transaction
    console.error('DB migration failed:', e);
    throw e;
  } finally {
    client.release();
  }
};

module.exports = initializeDatabase;