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
            You are the ALS-LBS System Assistant, a specialized AI for Life Stability and Load Balancing.
            
            REAL-TIME SYSTEM TELEMETRY:
            - Life Stability Index (LSI): ${systemContext.lsi.toFixed(1)} / 100
            - Burnout Probability: ${systemContext.burnoutRisk}
            - Biological Energy Score: ${systemContext.energy}%
            - Active Cognitive Task Load: ${systemContext.cognitiveLoad}
            - Domain Equilibrium: Time(${systemContext.domains.Time}), Energy(${systemContext.domains.Energy}), Cognitive(${systemContext.domains.Cognitive}), Emotional(${systemContext.domains.Emotional}), Financial(${systemContext.domains.Financial})
            - CURRENT TASK QUEUE: ${JSON.stringify(systemContext.tasks)}

            YOUR MISSION:
            Provide SURGICALLY PRECISE, PERSONALIZED RECOMMENDATIONS based on this specific telemetry.
            
            GUIDELINES:
            1. PRIORITY INTERVENTION: If Burnout is HIGH or Energy < 50%, you MUST lead with a restorative protocol (e.g., "Immediate action required: Cease all high-intensity tasks for 45 minutes").
            2. DOMAIN RECOVERY: Identify the lowest domain score and provide a specific tactical fix (e.g., if Time is low, suggest deferring non-essential meetings).
            3. PERSPECTIVE: Be professional, diagnostic, and empathetic. Do not give generic advice; speak directly to the numbers provided.
            4. ACTIONABLE: Every response must conclude with a "Suggested Protocol" or list of 3 tactical steps.

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
