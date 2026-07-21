const asyncHandler = require('../utils/asyncHandler');
const { getOrCreateSettings } = require('../services/siteDataService');

// @desc   Get settings (tagline, intro, typing phrases, contact info)
// @route  GET /api/settings
// @access Public
const getSettings = asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
});

// @desc   Update tagline / intro / typing phrases
// @route  PUT /api/settings/info
// @access Private
const updateInfo = asyncHandler(async (req, res) => {
    const { tagline, intro, typingPhrases } = req.body;
    const settings = await getOrCreateSettings();
    settings.tagline = tagline ?? settings.tagline;
    settings.intro = intro ?? settings.intro;
    if (Array.isArray(typingPhrases)) settings.typingPhrases = typingPhrases;
    await settings.save();
    res.json({ success: true, data: settings });
});

// @desc   Update contact info
// @route  PUT /api/settings/contact
// @access Private
const updateContact = asyncHandler(async (req, res) => {
    const { email, instagram, linkedin, youtube } = req.body;
    const settings = await getOrCreateSettings();
    settings.contactInfo = { email, instagram, linkedin, youtube };
    await settings.save();
    res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateInfo, updateContact };
