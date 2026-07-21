const Member = require('../models/Member');
const Achievement = require('../models/Achievement');
const MajorProject = require('../models/MajorProject');
const MiniProject = require('../models/MiniProject');
const Settings = require('../models/Settings');

const getOrCreateSettings = async () => {
    let settings = await Settings.findOne({ key: 'site_settings' });
    if (!settings) settings = await Settings.create({ key: 'site_settings' });
    return settings;
};

/* Aggregates every collection into the single shape the frontend expects
   (mirrors the old localStorage DEFAULT_DATA object). */
const getAggregatedData = async () => {
    const [members, achievements, majorProjects, miniProjects, settings] = await Promise.all([
        Member.find().sort({ order: 1, createdAt: 1 }),
        Achievement.find().sort({ order: 1, createdAt: 1 }),
        MajorProject.find().sort({ order: 1, createdAt: 1 }),
        MiniProject.find().sort({ order: 1, createdAt: 1 }),
        getOrCreateSettings()
    ]);

    return {
        members,
        achievements,
        majorProjects,
        miniProjects,
        tagline: settings.tagline,
        intro: settings.intro,
        typingPhrases: settings.typingPhrases,
        contactInfo: settings.contactInfo
    };
};

module.exports = { getAggregatedData, getOrCreateSettings };
