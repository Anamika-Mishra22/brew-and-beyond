const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order (Standard / COD / Razorpay / Direct UPI QR)
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount, paymentMethod, paymentId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const userId = req.user._id || req.user.id || req.user;

    // 🟢 Payment Status and Method mapping logic
    const selectedMethod = paymentMethod || 'COD';
    const isOrderPaid = selectedMethod === 'RAZORPAY';

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: selectedMethod,
      paymentId: paymentId || (selectedMethod === 'COD' ? 'COD_PAYMENT' : 'UPI_QR_DIRECT'),
      isPaid: isOrderPaid,
      paidAt: isOrderPaid ? Date.now() : null,
      status: 'Placed', // Direct kitchen status for all orders
    });

    const createdOrder = await order.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // 🟢 1. Real-time Socket Event: Admin dashboard par new order alert trigger karein
    const io = req.app.get('io');
    if (io) {
      const populatedOrder = await Order.findById(createdOrder._id).populate('user', 'name email');
      io.emit('new_order_placed', populatedOrder || createdOrder);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();

      // 🟢 2. Real-time Socket Event: Customer status updates tracking
      const io = req.app.get('io');
      if (io) {
        io.emit('order_status_updated', updatedOrder);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 CREATE RAZORPAY ORDER
const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: 'Valid totalAmount is required' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(totalAmount) * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(201).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('RAZORPAY API ERROR DETAILED:', error?.error || error?.message || error);

    return res.status(500).json({
      message: error?.error?.description || error?.message || 'Razorpay order creation failed',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
};