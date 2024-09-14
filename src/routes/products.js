const express = require('express');
const router = express.Router();
const { authenticate, isSeller } = require('../middlewares/auth');
const { createProduct, deleteProduct, updateProduct, getProductsByCategory, getProductsByName,getProductById } = require('../models/product');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { category, name } = req.query;
    console.log(`Received query - category: ${category}, name: ${name}`);
    
    let products;
    if (category) {
      products = await getProductsByCategory(category);
    } else if (name) {
      products = await getProductsByName(name);
    } else {
      return res.status(400).json({ error: 'Please provide either category or name query parameter' });
    }
    
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.use(isSeller);

router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, discount = 0 } = req.body;
    console.log("Request body:", req.body);
    console.log("User ID:", req.user.id);

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await createProduct(name, description, price, category, req.user.id, discount);
    console.log("Created product:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const sellerId = req.user.id;

    // Check if the product exists and belongs to the seller
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (existingProduct.seller_id !== sellerId) {
      return res.status(403).json({ error: 'You do not have permission to update this product' });
    }

    const updatedProduct = await updateProduct(productId, updates, sellerId);
    if (!updatedProduct) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }

});

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user.id;

    // Check if the product exists and belongs to the  seller
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (existingProduct.seller_id !== sellerId) {
      return res.status(403).json({ error: 'You do not have permission to delete this product' });
    }

    const deletedProduct = await deleteProduct(productId, sellerId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;