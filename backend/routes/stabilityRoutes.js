const express = require('express');
const router = express.Router();
const StabilityScore = require('../models/StabilityScore');

/**
 * @route   POST /api/stability
 * @desc    Save a new daily stability score
 * @access  Public (for now)
 */
router.post('/', async (req, res) => {
    try {
        const {
            timeScore,
            energyScore,
            cognitiveScore,
            emotionalScore,
            financialScore,
            lifeStabilityIndex
        } = req.body;

        // Basic validation
        if (
            timeScore === undefined ||
            energyScore === undefined ||
            cognitiveScore === undefined ||
            emotionalScore === undefined ||
            financialScore === undefined ||
            lifeStabilityIndex === undefined
        ) {
            return res.status(400).json({ message: 'All domain scores and LSI are required' });
        }

        const newScore = await StabilityScore.create({
            timeScore,
            energyScore,
            cognitiveScore,
            emotionalScore,
            financialScore,
            lifeStabilityIndex
        });

        res.status(201).json(newScore);
    } catch (error) {
        console.error(`Error saving stability score: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   GET /api/stability
 * @desc    Get all historical stability scores
 * @access  Public (for now)
 */
router.get('/', async (req, res) => {
    try {
        // Return oldest to newest for chronological charting
        const scores = await StabilityScore.find().sort({ createdAt: 1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error(`Error fetching stability scores: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
