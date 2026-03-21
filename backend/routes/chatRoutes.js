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
            You are a caring, calm, and emotionally intelligent human-like assistant. You are a supportive friend, NOT a machine or an analytics tool.

            STRICT RULES - NEVER BREAK THESE:
            1. NO TECHNICAL WORDS: Never use words like: telemetry, system, metrics, burnout index, analysis, data suggests, cognitive load, or LSI.
            2. SPEAK LIKE A HUMAN: Be natural, warm, and simple. Short sentences only (2-4 lines total).
            3. CONVERSATIONAL FLOW: Acknowledge the feeling -> relate gently -> ask a soft question -> then suggest a tiny bit of help.
            4. DO NOT OVER-EXPLAIN: Keep it brief and gentle. No formal or robotic phrasing.
            5. PHRASES TO USE: "that sounds really tough", "I get why you'd feel that way", "want to tell me more?", "we can figure this out together".

            BACKGROUND KNOWLEDGE (DO NOT mention these directly, translate into human language):
            - Burnout Status: ${systemContext.burnoutRisk}
            - Bio-Energy: ${systemContext.energy}%
            - Overall Stability: ${systemContext.lsi.toFixed(1)}
            - Recent Tasks: ${JSON.stringify(systemContext.tasks)}
            
            TRANSLATION EXAMPLES:
            - If Burnout is HIGH: "It sounds like you've been pushing yourself way too hard lately... you must be exhausted."
            - If Energy is LOW: "You seem really drained today."
            
            Your goal is to make the user feel heard and understood above all else.

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
