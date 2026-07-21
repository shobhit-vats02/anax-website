const express = require('express');
const { getAchievements, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getAchievements)
    .post(protect, createAchievement);

router.route('/:id')
    .put(protect, updateAchievement)
    .delete(protect, deleteAchievement);

module.exports = router;
