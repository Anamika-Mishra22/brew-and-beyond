const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const path = require('path');
// Environment Variables (.env) load karein
dotenv.config();

// Database Connect karein
connectDB();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ 1. MIDDLEWARES (Routes se pehle)
app.use(cors());         // SABSE PEHLE CORS ALLOW KAREIN
app.use(express.json()); // PHIR INCOMING JSON PARSE KAREIN

// HTTP Server aur Socket.io Initialize karein
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Socket.io Instance ko app state mein pass karein
app.set('io', io);

// ✅ 2. ROUTES REGISTER (Single Clean Declarations)
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);

// Test API Route
app.get('/', (req, res) => {
  res.send('Welcome to Brew & Beyond Cafe API!');
});

// 🟢 REAL-TIME SOCKET CONNECTION & EVENTS
io.on('connection', (socket) => {
  console.log('⚡ Client Connected:', socket.id);

  // Customer se naya order aaye toh Admin ko bhejo
  socket.on('new_order_placed', (orderData) => {
    console.log('🛒 New Order Placed:', orderData._id || 'New Order');
    io.emit('new_order_placed', orderData);
  });

  // Admin status badle toh Customer/MyOrders ko bhejo
  socket.on('update_order_status', (updatedOrder) => {
    console.log('🔄 Order Status Updated:', updatedOrder._id);
    io.emit('order_status_updated', updatedOrder);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client Disconnected:', socket.id);
  });
});

// 🟢 Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});