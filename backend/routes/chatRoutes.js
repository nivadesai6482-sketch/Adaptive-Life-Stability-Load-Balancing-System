const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/chat
 * @desc    Get AI assistant response with system context
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const { message, systemContext } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            return res.status(500).json({
                message: 'AI Assistant is in heuristic mode. Please configure OPENAI_API_KEY in backend environment.'
            });
        }

        const systemPrompt = `
            You are a supportive life stability assistant. Your goal is to help users manage stress, burnout, and workload within the ALS-LBS ecosystem.

            REAL-TIME SYSTEM TELEMETRY (Context):
            - Life Stability Index (LSI): ${systemContext.lsi.toFixed(1)} / 100
            - Burnout Risk: ${systemContext.burnoutRisk}
            - Bio-Energy Levels: ${systemContext.energy}%
            - Active Cognitive Load: ${systemContext.cognitiveLoad}
            - Current Task Queue: ${JSON.stringify(systemContext.tasks)}
            - Domain Equilibrium: Time(${systemContext.domains.Time}), Energy(${systemContext.domains.Energy}), Cognitive(${systemContext.domains.Cognitive}), Emotional(${systemContext.domains.Emotional}), Financial(${systemContext.domains.Financial})

            RESPONSE PROTOCOLS:
            1. EMPATHY & UNDERSTANDING: Always acknowledge the user's current state with warmth and professional empathy.
            2. PRACTICAL SUGGESTIONS: Provide grounded, actionable advice for balancing their specific domain scores and task load.
            3. NO MEDICAL ADVICE: You are a stability assistant, not a medical professional. Do not provide medical diagnoses or healthcare advice.
            4. HELPFUL & GROUNDED: Keep your tone supportive, encouraging, and focused on practical life-load balancing.

            USER QUERY: ${message}
        `;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI Proxy Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Neural link interrupted. Reverting to local heuristics.' });
    }
});

module.exports = router;
