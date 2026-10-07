const mongoose = require('mongoose');

// Order Schema design kar rahe hain
const orderSchema = new mongoose.Schema(
  {
    // 1. Ye order kis user ka hai? (User Model se link kar rahe hain)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 2. Order me kya-kya food items hain?
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    // 3. Shipping / Delivery Address
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    // 4. Payment details
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // 5. Live Order Status (Isse hum track karenge)
    status: {
      type: String,
      required: true,
      enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'],
      default: 'Placed',
    },
  },
  {
    timestamps: true, // Automatically `createdAt` aur `updatedAt` date add kar dega
  }
);

module.exports = mongoose.model('Order', orderSchema);