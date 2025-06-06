const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, addBooking, updateBooking, deleteBooking } = require('../controllers/bookingsController');

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', addBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;