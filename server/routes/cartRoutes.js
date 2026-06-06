const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, ctrl.getCart);
router.post('/', protect, ctrl.addToCart);
router.put('/', protect, ctrl.updateQuantity);
router.delete('/clear', protect, ctrl.clearCart);
router.delete('/:productId', protect, ctrl.removeFromCart);

module.exports = router;
