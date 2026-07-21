const asyncHandler = require('../utils/asyncHandler');
const Achievement = require('../models/Achievement');

// @desc   List achievements
// @route  GET /api/achievements
// @access Public
const getAchievements = asyncHandler(async (req, res) => {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: achievements });
});

// @desc   Create achievement
// @route  POST /api/achievements
// @access Private
const createAchievement = asyncHandler(async (req, res) => {
    const { title, rank, icon, description, meta } = req.body;
    const achievement = await Achievement.create({ title, rank, icon, description, meta });
    res.status(201).json({ success: true, data: achievement });
});

// @desc   Update achievement
// @route  PUT /api/achievements/:id
// @access Private
const updateAchievement = asyncHandler(async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
        res.status(404);
        throw new Error('Achievement not found');
    }
    const { title, rank, icon, description, meta } = req.body;
    achievement.title = title ?? achievement.title;
    achievement.rank = rank ?? achievement.rank;
    achievement.icon = icon ?? achievement.icon;
    achievement.description = description ?? achievement.description;
    achievement.meta = meta ?? achievement.meta;
    await achievement.save();
    res.json({ success: true, data: achievement });
});

// @desc   Delete achievement
// @route  DELETE /api/achievements/:id
// @access Private
const deleteAchievement = asyncHandler(async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
        res.status(404);
        throw new Error('Achievement not found');
    }
    await achievement.deleteOne();
    res.json({ success: true, message: 'Achievement deleted' });
});

module.exports = { getAchievements, createAchievement, updateAchievement, deleteAchievement };
