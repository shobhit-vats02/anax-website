const mongoose = require('mongoose');

const metaItemSchema = new mongoose.Schema(
    {
        icon: { type: String, default: 'fas fa-star' },
        text: { type: String, default: '' }
    },
    { _id: false }
);

const achievementSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true },
        rank: { type: String, required: [true, 'Rank is required'], trim: true },
        icon: { type: String, default: 'fas fa-star' },
        description: { type: String, default: '', trim: true },
        meta: { type: [metaItemSchema], default: [] },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
