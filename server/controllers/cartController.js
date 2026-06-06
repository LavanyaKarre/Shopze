const Cart = require('../models/Cart');

// @route GET /api/cart  (protected)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/cart  (protected)  body: { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) item.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity: Number(quantity) });

    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/cart  (protected)  body: { productId, quantity }  -> set absolute quantity
const updateQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) item.quantity = Math.max(1, Number(quantity));
    await cart.save();
    const populated = await cart.populate('items.product');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart/:productId  (protected)
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await cart.populate('items.product');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart  (protected)  -> clear whole cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
