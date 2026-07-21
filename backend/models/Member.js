const mongoose = require('mongoose');

const socialsSchema = new mongoose.Schema(
    {
        linkedin: { type: String, default: '', trim: true },
        github: { type: String, default: '', trim: true },
        leetcode: { type: String, default: '', trim: true },
        gmail: { type: String, default: '', trim: true },
        instagram: { type: String, default: '', trim: true }
    },
    { _id: false }
);

const memberSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true },
        role: { type: String, required: [true, 'Role is required'], trim: true },
        photo: { type: String, trim: true, default: '' },
        intro: { type: String, trim: true, default: '' },
        socials: { type: socialsSchema, default: () => ({}) },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
