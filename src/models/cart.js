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
  try {
    console.log("before query");
    const query = `
      SELECT 
        cart.id AS cart_id,
        cart.user_id,
        cart.product_id,
        cart.created_at,
        cart.updated_at,
        products.name AS product_name,
        products.description,
        products.price,
        products.category,
        products.seller_id,
        products.discount
      FROM 
        cart
      INNER JOIN 
        products
      ON 
        cart.product_id = products.id
      WHERE 
        cart.user_id = $1
    `;
    console.log("after query");
    const result = await db.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};



module.exports = { addToCart, removeFromCart, getCartByUserId };