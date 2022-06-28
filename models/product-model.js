const mongoose = require("mongoose");

//Model for the product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    maxLength: [20, "Name cannot be more than 20 characters"],
    minLength: [2, "Name cannot be less than 2 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price must be given"],
  },
  company: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

module.exports = mongoose.model("Product", productSchema);
