const express = require('express');
const router = express.Router();
const { getAllSeats, getSeatById, addSeat, updateSeat, deleteSeat } = require('../controllers/seatsController');

router.get('/', getAllSeats);
router.get('/:id', getSeatById);
router.post('/', addSeat);
router.put('/:id', updateSeat);
router.delete('/:id', deleteSeat);

module.exports = router;