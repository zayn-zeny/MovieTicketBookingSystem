const express = require('express');
const router = express.Router();
const { getAllReviews, getReviewById, addReview, updateReview, deleteReview } = require('../controllers/reviewsController');

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', addReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;