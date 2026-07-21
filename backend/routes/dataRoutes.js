const express = require('express');
const { getSiteData, exportData, importData, resetData } = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getSiteData);
router.get('/export', protect, exportData);
router.post('/import', protect, importData);
router.post('/reset', protect, resetData);

module.exports = router;
