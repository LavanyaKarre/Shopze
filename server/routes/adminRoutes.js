const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/orders', protect, admin, ctrl.getAllOrders);
router.get('/users', protect, admin, ctrl.getAllUsers);

module.exports = router;