const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrder,
  getOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  getAdminStats
} = require('../controllers/orderController');
const { protectAdmin, optionalUser } = require('../middleware/authMiddleware');

// Customer / Public
router.post('/', optionalUser, createOrder);
router.get('/track/:orderId', trackOrder);

// Admin protected
router.get('/stats/overview', protectAdmin, getAdminStats);
router.get('/', protectAdmin, getOrdersAdmin);
router.get('/:id', protectAdmin, getOrderByIdAdmin);
router.patch('/:id/status', protectAdmin, updateOrderStatusAdmin);

module.exports = router;
