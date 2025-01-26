const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user && req.user.type === 'seller') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Sellers only.' });
  }
};

// const isBuyer = (req, res, next) => {
//   if (req.user && req.user.type === 'buyer') {
//     next();
//   } else {
//     res.status(403).json({ error: 'Access denied. Buyers only.' });
//   }
// };

module.exports = { authenticate, isSeller};
