const mongoose = require('mongoose');

const ProductListingsSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  images_list: { type: [String], required: true }, // assuming it's a list of image URLs
  product_title: { type: String, required: true },
  price: { type: String, required: true },
  product_details: { type: Object, required: true }, // assuming it's a JSON object
  about_this_item: { type: String, required: true },
  product_description: { type: String, required: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ProductListings', ProductListingsSchema);
