const mongoose = require('mongoose');

// A single settings document holding store-wide admin data:
// banner images shown on the homepage and the list of categories.
const adminSchema = new mongoose.Schema(
  {
    bannerImages: [{ type: String }],
    categories: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
