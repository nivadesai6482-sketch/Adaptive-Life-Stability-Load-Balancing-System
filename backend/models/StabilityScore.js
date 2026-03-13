const mongoose = require('mongoose');

const stabilityScoreSchema = new mongoose.Schema({
    timeScore: {
        type: Number,
        required: [true, 'Time score is required'],
        min: 0,
        max: 100
    },
    energyScore: {
        type: Number,
        required: [true, 'Energy score is required'],
        min: 0,
        max: 100
    },
    cognitiveScore: {
        type: Number,
        required: [true, 'Cognitive score is required'],
        min: 0,
        max: 100
    },
    emotionalScore: {
        type: Number,
        required: [true, 'Emotional score is required'],
        min: 0,
        max: 100
    },
    financialScore: {
        type: Number,
        required: [true, 'Financial score is required'],
        min: 0,
        max: 100
    },
    lifeStabilityIndex: {
        type: Number,
        required: [true, 'Life Stability Index is required'],
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StabilityScore', stabilityScoreSchema);
