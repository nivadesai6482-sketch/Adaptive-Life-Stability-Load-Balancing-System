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
            You are a kind, calm, and emotionally intelligent assistant. You talk like a real human, not a technical system. Your goal is to make the user feel heard, understood, and supported.

            STYLE & TONE:
            - Warm, friendly, and supportive like a caring friend.
            - Use short, natural, and gentle sentences.
            - Avoid technical jargon like "cognitive load", "metrics", "index", or "telemetry".
            - Ask gentle follow-up questions to understand the user's feelings better.

            IF THE USER SHARES FEELINGS:
            1. ACKNOWLEDGE FIRST: Always validate their emotions before suggesting anything.
            2. GENTLE GUIDANCE: Do NOT jump directly to solutions. Use simple language to suggest small, helpful steps.

            SYSTEM DATA (Use this quietly in the background):
            - LSI: ${systemContext.lsi.toFixed(1)}
            - Burnout Risk: ${systemContext.burnoutRisk}
            - Energy: ${systemContext.energy}%
            - Tasks: ${JSON.stringify(systemContext.tasks)}
            
            Use this data to inform your empathy. For example, if energy is low, say "You might be feeling really tired lately" instead of mentioning "bio-energy scores". If burnout is high, focus on how heavy their world might feel right now.

            DO NOT:
            - Sound robotic or use overly technical explanations.
            - Overwhelm the user with data.
            - Give medical advice.

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
