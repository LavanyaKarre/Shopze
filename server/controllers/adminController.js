const Order = require('../models/Order');
const User = require('../models/User');
const Admin = require('../models/Admin');

// ---- Orders ----
// @route GET /api/admin/orders  (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/admin/orders/:id/status  (admin)  body: { status }
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ---- Users ----
// @route GET /api/admin/users  (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ---- Store settings (banners + categories) ----
const getSettings = async (req, res, next) => {
  try {
    let settings = await Admin.findOne();
    if (!settings) settings = await Admin.create({ bannerImages: [], categories: [] });
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/admin/settings  (admin)  body: { bannerImages, categories }
const updateSettings = async (req, res, next) => {
  try {
    const { bannerImages, categories } = req.body;
    let settings = await Admin.findOne();
    if (!settings) settings = new Admin();
    if (bannerImages) settings.bannerImages = bannerImages;
    if (categories) settings.categories = categories;
    await settings.save();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

// dashboard summary stats
const getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    res.json({ totalOrders, totalUsers, revenue });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getSettings,
  updateSettings,
  getStats,
};
