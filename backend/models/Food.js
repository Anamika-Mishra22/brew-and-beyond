const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    // Allowed categories for high-end boutique cafe vibe
    enum: ['Specialty Coffee', 'Bakery & Pastries', 'Gourmet Plates', 'Desserts', 'Beverages'] 
  },
  image: { type: String, required: true }, // Image URL
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);