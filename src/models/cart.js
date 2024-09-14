const db = require('../config/db');

const addToCart = async (userId, productId) => {
  const query = 'INSERT INTO cart (user_id, product_id) VALUES ($1, $2) RETURNING *';
  const values = [userId, productId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const removeFromCart = async (userId, cartItemId) => {
  const query = 'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *';
  const values = [cartItemId, userId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getCartByUserId = async (userId) => {
  const query = 'SELECT * FROM cart WHERE user_id = $1';
  const result = await db.query(query, [userId]);
  return result.rows;
};

module.exports = { addToCart, removeFromCart, getCartByUserId };