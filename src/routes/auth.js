const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername, getUserByEmail } = require('../models/user');
const { isValidEmail, isValidUsername, isValidPassword } = require('../utilities/validate');
require('dotenv').config();


router.post('/register', async (req, res) => {
  try {
    const { username, email, password, type } = req.body;
    if (!username || !email || !password || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate username
    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        error: 'Invalid username. Username must be 3-30 characters long, start with a letter, and contain only letters, numbers, underscores, or hyphens.'
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if username already exists
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.' });
    }

    // Validate user type
    const validTypes = ['buyer', 'seller'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    const user = await createUser(username, email, password, type);
    res.status(201).json({ id: user.id, username: user.username, email: user.email, type: user.type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Determine if the identifier is an email or username
    const isEmail = identifier.includes('@');
    
    let user;
    if (isEmail) {
      user = await getUserByEmail(identifier);
    } else {
      user = await getUserByUsername(identifier);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '5h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, type: user.type } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;