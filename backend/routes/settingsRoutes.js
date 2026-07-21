const express = require('express');
const { getSettings, updateInfo, updateContact } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getSettings);
router.put('/info', protect, updateInfo);
router.put('/contact', protect, updateContact);

module.exports = router;
