const Member = require('../models/Member');
const Achievement = require('../models/Achievement');
const MajorProject = require('../models/MajorProject');
const MiniProject = require('../models/MiniProject');
const seedDatabase = require('../seed/seedData');
const { getAggregatedData, getOrCreateSettings } = require('./siteDataService');

const createBackup = async () => getAggregatedData();

/* Strips DB-generated fields so re-inserting a previously exported backup
   (or one exported from another environment) doesn't collide on _id. */
const stripMeta = (arr = []) =>
    arr.map(({ _id, id, __v, createdAt, updatedAt, ...rest }) => rest);

const restoreFromBackup = async (payload) => {
    const { members, achievements, majorProjects, miniProjects, tagline, intro, typingPhrases, contactInfo } = payload;

    if (!Array.isArray(members) || !Array.isArray(achievements)) {
        const err = new Error('Invalid backup file format');
        err.statusCode = 400;
        throw err;
    }

    await Promise.all([
        Member.deleteMany({}),
        Achievement.deleteMany({}),
        MajorProject.deleteMany({}),
        MiniProject.deleteMany({})
    ]);

    await Promise.all([
        members.length ? Member.insertMany(stripMeta(members)) : Promise.resolve(),
        achievements.length ? Achievement.insertMany(stripMeta(achievements)) : Promise.resolve(),
        (majorProjects || []).length ? MajorProject.insertMany(stripMeta(majorProjects)) : Promise.resolve(),
        (miniProjects || []).length ? MiniProject.insertMany(stripMeta(miniProjects)) : Promise.resolve()
    ]);

    const settings = await getOrCreateSettings();
    settings.tagline = tagline ?? settings.tagline;
    settings.intro = intro ?? settings.intro;
    settings.typingPhrases = typingPhrases ?? settings.typingPhrases;
    settings.contactInfo = contactInfo ?? settings.contactInfo;
    await settings.save();
};

const resetToDefaults = async () => {
    await seedDatabase({ resetOnly: true });
};

module.exports = { createBackup, restoreFromBackup, resetToDefaults };
