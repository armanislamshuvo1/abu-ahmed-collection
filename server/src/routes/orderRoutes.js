const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrder,
  submitOrderTransactionId,
  getOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  getAdminStats
} = require('../controllers/orderController');
const { protectAdmin, optionalUser } = require('../middleware/authMiddleware');

// Customer / Public
router.post('/', optionalUser, createOrder);
router.get('/track/:orderId', trackOrder);
router.patch('/track/:orderId/transaction-id', submitOrderTransactionId);

// Admin protected
router.get('/stats/overview', protectAdmin, getAdminStats);
router.get('/', protectAdmin, getOrdersAdmin);
router.get('/:id', protectAdmin, getOrderByIdAdmin);
router.patch('/:id/status', protectAdmin, updateOrderStatusAdmin);

module.exports = router;
