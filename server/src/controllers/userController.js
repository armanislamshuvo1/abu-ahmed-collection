const User = require('../models/User');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @desc    Register a new customer
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, address, city } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      address: address || '',
      city: city || 'Dhaka',
      role: 'customer'
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role || 'customer',
        token: generateToken(user._id)
      });
    }

    return res.status(400).json({ message: 'Invalid customer data' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    User / Admin unified login
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check User collection
    const user = await User.findOne({ email: cleanEmail });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        role: user.role || 'customer',
        token: generateToken(user._id)
      });
    }

    // 2. Fallback to Admin collection so admins can log in seamlessly
    const admin = await Admin.findOne({ email: cleanEmail });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: '',
        address: '',
        city: '',
        role: admin.role || 'admin',
        token: generateToken(admin._id)
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.city = req.body.city || user.city;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      role: updatedUser.role || 'customer',
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's order history
// @route   GET /api/users/my-orders
// @access  Private (User)
const getUserOrders = async (req, res) => {
  try {
    // Match either by linked userId OR by customer email
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { 'customer.email': req.user.email.toLowerCase().trim() }]
    }).sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserOrders
};
