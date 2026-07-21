const mongoose = require('mongoose');

const miniProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true },
        desc: { type: String, default: '', trim: true },
        completion: { type: Number, min: 0, max: 100, default: 0 },
        link: { type: String, default: '', trim: true },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('MiniProject', miniProjectSchema);
