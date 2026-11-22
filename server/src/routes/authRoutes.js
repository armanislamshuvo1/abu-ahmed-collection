const express = require('express');
const router = express.Router();
const { adminLogin, getAdminMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/admin/login', adminLogin);
router.get('/admin/me', protectAdmin, getAdminMe);

module.exports = router;
