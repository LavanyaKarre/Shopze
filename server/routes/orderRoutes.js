const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, ctrl.createOrder);
router.get('/myorders', protect, ctrl.getMyOrders);
router.get('/:id', protect, ctrl.getOrderById);

module.exports = router;
