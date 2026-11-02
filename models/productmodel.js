const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productIdNumber: {
    type: Number,
  },

  title: {
    type: String,
  },

  isNew: {
    type: Boolean,
  },

  oldPrice: {
    type: Number,
  },

  price: {
    type: Number,
  },

  discountedPrice: {
    type: Number,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
  },

  type: {
    type: String,
  },

  stock: {
    type: Number,
  },

  brand: {
    type: String,
  },

  size: {
    type: [String],
  },

  image: {
    type: String,
  },

  rating: {
    type: Number,
  },

  quantity: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("product", productSchema);