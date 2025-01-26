const express = require('express');
const router = express.Router();
const { authenticate} = require('../middlewares/auth');
const { addToCart, removeFromCart, getCartByUserId } = require('../models/cart');

router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cartItem = await addToCart(req.user.id, productId);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user.id;
    const result = await removeFromCart(userId, cartItemId);
    if (result) {
      res.status(200).json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log("hey fukc offf ");
    const cart = await getCartByUserId(req.user.id);
    res.json(cart);
  } catch (error) {
    console.log("fuck off ");
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;