const Order = require('../models/Order');
const User = require('../models/User');

// View all orders (admin)
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product');
  res.json(orders);
};

// View all users (admin)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};