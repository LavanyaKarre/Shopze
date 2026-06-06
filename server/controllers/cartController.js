const Cart = require('../models/Cart');

// Get logged-in user's cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
  } else {
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
  }
  res.json(cart);
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
};