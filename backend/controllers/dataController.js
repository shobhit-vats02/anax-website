const asyncHandler = require('../utils/asyncHandler');
const { getAggregatedData } = require('../services/siteDataService');
const { createBackup, restoreFromBackup, resetToDefaults } = require('../services/backupService');

// @desc   Aggregated public site data (members + achievements + projects + settings)
// @route  GET /api/data
// @access Public
const getSiteData = asyncHandler(async (req, res) => {
    const data = await getAggregatedData();
    res.json({ success: true, data });
});

// @desc   Download a full JSON backup
// @route  GET /api/data/export
// @access Private
const exportData = asyncHandler(async (req, res) => {
    const backup = await createBackup();
    res.json(backup);
});

// @desc   Restore from a JSON backup (replaces all content collections)
// @route  POST /api/data/import
// @access Private
const importData = asyncHandler(async (req, res) => {
    await restoreFromBackup(req.body);
    res.json({ success: true, message: 'Data imported successfully' });
});

// @desc   Reset all content to factory defaults (admin credentials untouched)
// @route  POST /api/data/reset
// @access Private
const resetData = asyncHandler(async (req, res) => {
    await resetToDefaults();
    res.json({ success: true, message: 'Data reset to defaults' });
});

module.exports = { getSiteData, exportData, importData, resetData };
