const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Check Admin collection
      req.admin = await Admin.findById(decoded.id).select('-password');
      // If not in Admin collection, check User collection with role === 'admin'
      if (!req.admin) {
        const userAdmin = await User.findById(decoded.id).select('-password');
        if (userAdmin && userAdmin.role === 'admin') {
          req.admin = userAdmin;
        }
      }

      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized as an admin' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired', error: error.message });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no admin token provided' });
};

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Customer account not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired', error: error.message });
    }
  }
  return res.status(401).json({ message: 'Not authorized, please login' });
};

const optionalUser = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

module.exports = {
  protectAdmin,
  protectUser,
  optionalUser
};
