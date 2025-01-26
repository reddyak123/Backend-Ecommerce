const express = require('express');
const bodyParser = require('body-parser');
const initializeDatabase = require('./config/initializeDatabase');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const  cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const createTables = async () => {
await initializeDatabase();
};

createTables();

app.listen(port, ()=>{console.log(`running on ${port}`)});
// module.exports = app;
