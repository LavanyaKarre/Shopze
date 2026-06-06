const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, ctrl.getStats);
router.get('/orders', protect, admin, ctrl.getAllOrders);
router.put('/orders/:id/status', protect, admin, ctrl.updateOrderStatus);
router.get('/users', protect, admin, ctrl.getAllUsers);
router.get('/settings', ctrl.getSettings);
router.put('/settings', protect, admin, ctrl.updateSettings);

module.exports = router;
