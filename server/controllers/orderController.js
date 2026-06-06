const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Place an order (checkout)
exports.createOrder = async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
  const order = await Order.create({
    user: req.user._id, items, totalAmount, shippingAddress, paymentMethod,
  });
  // Clear the user's cart after ordering
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
};

// Get logged-in user's orders (for profile page)
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};