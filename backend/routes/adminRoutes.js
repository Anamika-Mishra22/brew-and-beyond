const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); 
const Order = require('../models/Order');
const { getAdminDashboardStats, getUsers, 
  deleteUser } = require('../controllers/adminController'); // 🟢 Controller import

// 🟢 0. Admin Dashboard Live Stats Route
router.get('/dashboard-stats', protect, admin, getAdminDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// 🟢 1. Saare users ke orders dekhne ke liye (Admin Only)
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// 🟢 2. Order status update karne ke liye (e.g. Preparing -> Out for Delivery -> Delivered)
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {   
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
           
    if (order) {
      order.status = status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;