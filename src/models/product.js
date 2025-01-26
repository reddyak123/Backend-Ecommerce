const db = require('../config/db');

const createProduct = async (name, description, price, category, sellerId, discount=0) => {
  const query = 'INSERT INTO products (name, description, price, category, seller_id, discount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [name, description, price, category, sellerId, discount];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

const updateProduct = async (productId, newDetails, sellerId) => {
  const fieldsWeCanUpdate = ['name', 'description', 'price', 'category', 'discount'];
  let fieldsToUpdate = [];

  let index = 2;  // Start from 2 because $1 will be used for productId
  for (let field in newDetails) {
    if (fieldsWeCanUpdate.includes(field) && newDetails[field] != null) {
      fieldsToUpdate.push(`${field} = $${index}`);
      index++;
    }
  }

  if (fieldsToUpdate.length === 0) return null;

  const query = `
    UPDATE products 
    SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND seller_id = $${index}
    RETURNING *
  `;

  let queryValues = [productId];
  for (let field of fieldsWeCanUpdate) {
    if (field in newDetails) {
      queryValues.push(newDetails[field]);
    }
  }
  queryValues.push(sellerId);
  const result = await db.query(query, queryValues);
  return result.rows[0];
};

const deleteProduct = async (id, sellerId) => {
  const query = 'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *';
  const result = await db.query(query, [id, sellerId]);
  return result.rows[0];
};

const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getProductsByCategory = async (category) => {
  const query = 'SELECT * FROM products WHERE category = $1';
  const result = await db.query(query, [category]);
  return result.rows;
};

const getProductsByName = async (name) => {
  const query = 'SELECT * FROM products WHERE name = $1';
  const result = await db.query(query, [name]);
  return result.rows;
};

const getProducts = async()=>{
  const query = 'SELECT * FROM products';
  const result = await db.query(query);
  return result.rows;
}

module.exports = { 
  createProduct, 
  getProductsByCategory, 
  getProductsByName, 
  updateProduct, 
  deleteProduct,
  getProductById,
  getProducts
};

