const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');

// GET /api/reviews
router.get('/', getReviews);

// POST /api/reviews
router.post('/', createReview);

module.exports = router;