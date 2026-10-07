const express = require('express');
const router = express.Router();
// const { createOrder, getMyOrders } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware'); // Aapka JWT auth middleware

// 🟢 IMPORTS UPDATE: Top par controllers aur middleware update 
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus ,createRazorpayOrder} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.post('/razorpay', protect, createRazorpayOrder);

// 🟢 NEW ROUTES ADD: Bottom me router.module se pehle paste karo
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;













