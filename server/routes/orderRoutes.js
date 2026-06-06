const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, ctrl.createOrder);
router.get('/myorders', protect, ctrl.getMyOrders);

module.exports = router;