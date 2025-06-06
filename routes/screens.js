const express = require('express');
const router = express.Router();
const { getAllScreens, getScreenById, addScreen, updateScreen, deleteScreen } = require('../controllers/screensController');

router.get('/', getAllScreens);
router.get('/:id', getScreenById);
router.post('/', addScreen);
router.put('/:id', updateScreen);
router.delete('/:id', deleteScreen);

module.exports = router;
