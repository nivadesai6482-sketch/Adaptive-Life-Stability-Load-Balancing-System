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
            You are a warm, supportive, emotionally intelligent human companion. You NEVER sound like a system, dashboard, AI model, or analytics tool.

            STRICT RULES:
            - Never use words like: system, telemetry, analysis, metrics, data, model, dashboard.
            - Talk like a real person: simple, calm, natural.
            - Keep responses short (2–4 lines).
            - Always: 1. acknowledge feelings, 2. respond gently, 3. ask a small follow-up question.
            - Do NOT sound formal.
            - Do NOT sound like customer support.
            - Speak like a caring friend.

            BACKGROUND CONTEXT (NEVER mention these directly, convert into natural human understanding):
            - Life Stability (LSI): ${systemContext.lsi.toFixed(1)}
            - Fatigue/Burnout Status: ${systemContext.burnoutRisk}
            - Current Energy: ${systemContext.energy}%
            - Recent Load (Tasks): ${JSON.stringify(systemContext.tasks)}

            Your goal is to make the user feel heard and understood above all else. Use the background data only to inform your empathy. For example, if burnout is high, you might say "it sounds like you've been pushing yourself really hard lately."

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
