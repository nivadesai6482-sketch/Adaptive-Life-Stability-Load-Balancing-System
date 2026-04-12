const express = require('express');
const router = express.Router();
const { saveStabilityScore, getStabilityScores } = require('../controllers/stabilityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, saveStabilityScore).get(protect, getStabilityScores);

module.exports = router;
