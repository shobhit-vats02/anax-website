const mongoose = require('mongoose');

const majorProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true },
        status: { type: String, enum: ['completed', 'ongoing', 'planning'], default: 'planning' },
        completion: { type: Number, min: 0, max: 100, default: 0 },
        description: { type: String, default: '', trim: true },
        tags: { type: [String], default: [] },
        link: { type: String, default: '', trim: true },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('MajorProject', majorProjectSchema);
