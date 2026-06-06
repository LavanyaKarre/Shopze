const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @route POST /api/orders  (protected)
// body: { items, shippingAddress, paymentMethod, notes, itemsPrice, shippingPrice, totalPrice }
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes, itemsPrice, shippingPrice, totalPrice } =
      req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No order items' });

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      notes,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'Confirmed',
    });

    // empty the cart after a successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/myorders  (protected)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/:id  (protected)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // only the owner or an admin may view
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
