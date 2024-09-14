const express = require('express');
const bodyParser = require('body-parser');
const initializeDatabase = require('./config/initializeDatabase');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const createTables = async () => {
await initializeDatabase();
};

createTables();

module.exports = app;