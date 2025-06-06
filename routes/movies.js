const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMoviesByName,
  getMoviesByGenre,
  getReviewsByMovie,
  getMoviesByRating,
  getMovieAnalyticsSummary
} = require('../controllers/moviesController');

router.get('/summary', getMovieAnalyticsSummary);
router.get('/rating', getMoviesByRating); 
router.get('/:id/reviews', getReviewsByMovie);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/search', searchMoviesByName);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', addMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
