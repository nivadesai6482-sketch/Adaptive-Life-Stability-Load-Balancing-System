const StabilityScore = require('../models/StabilityScore');

// @desc    Save a new daily stability score
// @route   POST /api/stability
// @access  Public
const saveStabilityScore = async (req, res) => {
    try {
        const {
            timeScore,
            energyScore,
            cognitiveScore,
            emotionalScore,
            financialScore,
            lifeStabilityIndex
        } = req.body;

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
};

// @desc    Get all historical stability scores
// @route   GET /api/stability
// @access  Public
const getStabilityScores = async (req, res) => {
    try {
        const scores = await StabilityScore.find().sort({ createdAt: 1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error(`Error fetching stability scores: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    saveStabilityScore,
    getStabilityScores
};
