const Review = require('../models/Review');

// 1. Get All Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. Add New Review
const createReview = async (req, res) => {
  try {
    const { name, location, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }

    const review = new Review({
      name,
      location: location || 'Customer',
      rating: Number(rating),
      comment
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getReviews,
  createReview
};