const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminsController');

router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.post('/', addAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;