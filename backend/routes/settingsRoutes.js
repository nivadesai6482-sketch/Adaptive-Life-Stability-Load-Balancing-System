const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user._id });

        // If no settings found, return default ones
        if (!settings) {
            settings = new Settings({ user: req.user._id });
            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error.message);
        res.status(500).json({ message: 'Server error while fetching settings' });
    }
});

/**
 * @route   POST /api/settings
 * @desc    Update or create user settings
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const {
            notificationsEnabled,
            burnoutAlerts,
            timeWeight,
            energyWeight,
            cognitiveWeight,
            emotionalWeight,
            financialWeight,
            burnoutThreshold,
            collapseThreshold
        } = req.body;

        // Find and update or create
        let settings = await Settings.findOneAndUpdate(
            { user: req.user._id },
            {
                notificationsEnabled,
                burnoutAlerts,
                timeWeight,
                energyWeight,
                cognitiveWeight,
                emotionalWeight,
                financialWeight,
                burnoutThreshold,
                collapseThreshold
            },
            { new: true, upsert: true }
        );

        res.json(settings);
    } catch (error) {
        console.error('Error saving settings:', error.message);
        res.status(500).json({ message: 'Server error while saving settings' });
    }
});

module.exports = router;
