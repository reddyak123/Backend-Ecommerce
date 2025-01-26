const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (username, email, password, type) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, email, password, type) VALUES ($1, $2, $3, $4) RETURNING id, username, email, type';
  const values = [username, email, hashedPassword, type];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await db.query(query, [username]);
  return result.rows[0];
};

module.exports = { createUser, getUserByUsername, getUserByEmail };