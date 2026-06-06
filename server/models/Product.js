const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String },
  image: { type: String },        // image URL
  stock: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    rating: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);