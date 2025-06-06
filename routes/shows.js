const express = require('express');
const router = express.Router();
const { getAllShows, getShowsByMovie, getShowById, addShow, updateShow, deleteShow } = require('../controllers/showsController');

router.get('/:movieId/shows', getShowsByMovie);
router.get('/', getAllShows);
router.get('/:id', getShowById);
router.post('/', addShow);
router.put('/:id', updateShow);
router.delete('/:id', deleteShow);

module.exports = router;