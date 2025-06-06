const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById,
  addPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentsController');

router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.post('/', addPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;