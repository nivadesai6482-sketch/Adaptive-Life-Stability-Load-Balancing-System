const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    burnoutAlerts: {
        type: Boolean,
        default: true
    },
    timeWeight: {
        type: Number,
        default: 75
    },
    energyWeight: {
        type: Number,
        default: 85
    },
    cognitiveWeight: {
        type: Number,
        default: 60
    },
    emotionalWeight: {
        type: Number,
        default: 90
    },
    financialWeight: {
        type: Number,
        default: 45
    },
    burnoutThreshold: {
        type: Number,
        default: 85
    },
    collapseThreshold: {
        type: Number,
        default: 40
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
