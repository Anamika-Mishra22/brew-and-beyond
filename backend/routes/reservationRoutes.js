const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/authMiddleware');

const { sendReservationEmail, sendStatusUpdateEmail } = require('../utils/sendEmail');

// 🟢 1. POST: Save New Table Reservation & Send Admin Email
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, dateTime, guests, seating, specialRequest } = req.body;

    if (!name || !email || !dateTime) {
      return res.status(400).json({ message: 'Name, Email, and Date/Time are required!' });
    }

    const newReservation = new Reservation({
      user: req.user._id,
      name,
      email,
      dateTime,
      guests,
      seating,
      specialRequest
    });

    await newReservation.save();

    try {
      await sendReservationEmail(newReservation);
    } catch (emailErr) {
      console.error("Admin notification email failed:", emailErr);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Table reserved successfully and email sent to admin!', 
      data: newReservation 
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: 'Server Error. Could not process reservation.' });
  }
});

//🟢 2. SPECIFIC STATIC GET ROUTE (Updated to search by user ID)
router.get('/my-reservations', protect, async (req, res) => {
  try {
    // req.user._id ka use karein jo 'protect' middleware deta hai
    const userReservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json(userReservations);
  } catch (error) {
    console.error("Error fetching user's reservations:", error);
    res.status(500).json({ message: 'Server Error. Could not fetch your reservations.' });
  }
});

// 🟢 3. GENERAL GET: Fetch All Reservations (Query filter ke saath)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const queryFilter = email ? { email } : {};

    const reservations = await Reservation.find(queryFilter).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: 'Server Error. Could not fetch reservations.' });
  }
});

// 4. PUT: Update Booking Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    try {
      await sendStatusUpdateEmail(
        updatedReservation.email,
        updatedReservation.name,
        updatedReservation.status,
        updatedReservation.dateTime
      );
    } catch (emailErr) {
      console.error("Customer status email error:", emailErr);
    }

    res.json({ success: true, data: updatedReservation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// 🟢 5. DELETE: Booking ko permanently hatane ke liye
router.delete('/:id', async (req, res) => { // 👈 Yahan (res, req) se badal kar (req, res) kar diya hai
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Reservation removed' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Failed to delete' });
  }
});

module.exports = router;