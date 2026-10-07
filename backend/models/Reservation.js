const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // 🟢 Yeh field add karna zaroori hai taaki user ki ID link ho sake
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateTime: {
    type: String,
    required: true
  },
  guests: {
    type: String,
    default: '2 Persons'
  },
  seating: {
    type: String,
    default: 'Window View'
  },
  specialRequest: {
    type: String,
    default: ''
  },
  // 🟢 Admin ke notes/response ke liye yeh bhi add kar sakte hain
  adminNote: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);