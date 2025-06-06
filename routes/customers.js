const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getCustomerBookings
} = require('../controllers/customersController');

router.get('/:id/bookings', getCustomerBookings);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);

module.exports = router;