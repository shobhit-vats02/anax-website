const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema(
    {
        email: { type: String, default: '', trim: true },
        instagram: { type: String, default: '', trim: true },
        linkedin: { type: String, default: '', trim: true },
        youtube: { type: String, default: '', trim: true }
    },
    { _id: false }
);

const settingsSchema = new mongoose.Schema(
    {
        key: { type: String, default: 'site_settings', unique: true },
        tagline: { type: String, default: '' },
        intro: { type: String, default: '' },
        typingPhrases: { type: [String], default: [] },
        contactInfo: { type: contactInfoSchema, default: () => ({}) }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
