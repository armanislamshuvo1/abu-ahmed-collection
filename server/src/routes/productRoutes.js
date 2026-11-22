const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/:slugOrId', getProductBySlugOrId);

// Admin protected endpoints
router.post('/', protectAdmin, upload.array('images', 8), createProduct);
router.put('/:id', protectAdmin, upload.array('images', 8), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.patch('/:id/toggle-stock', protectAdmin, toggleStock);

module.exports = router;
