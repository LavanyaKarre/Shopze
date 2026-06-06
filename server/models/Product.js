const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // percentage 0-100
    category: { type: String, default: 'General' },
    image: { type: String, default: '' }, // image URL
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }, // average rating
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// helper: final price after discount
productSchema.virtual('finalPrice').get(function () {
  return Math.round(this.price * (1 - this.discount / 100));
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
