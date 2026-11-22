const express = require('express');
const router = express.Router();
const {
  getPublicSettings,
  getAdminSettings,
  updateDeliverySettings,
  updateGeneralSettings,
  getPaymentMethodsAdmin,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/settingsController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public storefront
router.get('/public', getPublicSettings);

// Admin delivery and general store settings
router.get('/', protectAdmin, getAdminSettings);
router.put('/delivery', protectAdmin, updateDeliverySettings);
router.put('/general', protectAdmin, updateGeneralSettings);

// Admin payment methods manager
router.get('/payment-methods', protectAdmin, getPaymentMethodsAdmin);
router.post('/payment-methods', protectAdmin, createPaymentMethod);
router.put('/payment-methods/:id', protectAdmin, updatePaymentMethod);
router.delete('/payment-methods/:id', protectAdmin, deletePaymentMethod);

module.exports = router;
