const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = userResult.rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user ? req.user.role : 'unknown'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
