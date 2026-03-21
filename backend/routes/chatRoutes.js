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

        // Translate technical telemetry into human language before sending to AI
        const translateToHuman = (ctx) => {
            let narratives = [];

            // LSI Translation
            if (ctx.lsi > 85) narratives.push("User's life feels very balanced and stable right now.");
            else if (ctx.lsi > 70) narratives.push("User is doing okay but might be feeling a little bit off-balance.");
            else narratives.push("User's life balance is currently struggling and they feel quite unsettled.");

            // Burnout Translation
            if (ctx.burnoutRisk === 'HIGH') narratives.push("The user is pushing themselves way too hard and is at a breaking point.");
            else if (ctx.burnoutRisk === 'MEDIUM') narratives.push("The user has been feeling somewhat overwhelmed lately and may be mentally tired.");
            else narratives.push("The user seems to be managing their stress levels well.");

            // Energy Translation
            if (ctx.energy < 40) narratives.push("They are feeling deeply drained and physically exhausted.");
            else if (ctx.energy < 70) narratives.push("They might be starting to feel a bit tired or low on energy.");
            else narratives.push("They have a healthy amount of energy today.");

            return narratives.join(" ");
        };

        const humanNarrative = translateToHuman(systemContext);

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

            SITUATION (Use this purely to inform your empathy):
            ${humanNarrative} 
            Recent load: ${JSON.stringify(systemContext.tasks.map(t => t.title))}

            IMPORTANT:
            NEVER mention the technical data directly. Instead of "Your burnout risk is high", say things like "It sounds like you've been pushing yourself really hard lately."

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

        let aiResponse = response.data.choices[0].message.content;

        // Strict Human-Centric Jargon Firewall (User-defined)
        const forbidden = ["system", "telemetry", "analysis", "metrics", "model"];
        for (let word of forbidden) {
            aiResponse = aiResponse.replace(new RegExp(word, "gi"), "");
        }

        res.json({ response: aiResponse.trim() });
    } catch (error) {
        console.error('OpenAI Proxy Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Neural link interrupted. Reverting to local heuristics.' });
    }
});

module.exports = router;
