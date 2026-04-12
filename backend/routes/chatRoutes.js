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
    const { message, history } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    // Check for missing or placeholder keys
    if (!apiKey ||
        apiKey === 'your_key_here' ||
        apiKey === 'sk-xxxxxxxxxxxxxxxxxxxx' ||
        apiKey === 'sk-proj-xxxxxxxxxxxxxxxxxxxx') {

        const reason = !apiKey ? 'Missing' : 'Placeholder';
        console.error(`❌ ${reason} API_KEY (OpenAI or OpenRouter) in environment variables`);
        return res.status(500).json({
            message: 'AI Assistant key not configured. Please add your OpenRouter or OpenAI key to backend/.env.'
        });
    }

    try {
        console.log("🚀 Calling OpenRouter with key:", `${apiKey.substring(0, 12)}...`);

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openrouter/auto:free",
            messages: [
                {
                    role: "system",
                    content: "You are a warm, human, supportive assistant. Talk like a real person."
                },
                ...(history || []),
                { role: "user", content: message }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173", // OpenRouter requirement
                "X-Title": "ALS-LBS Assistant" // OpenRouter requirement
            }
        });

        const data = response.data;
        console.log("Response:", data);

        if (!data.choices) {
            console.error("OpenAI/OpenRouter Error:", data);
            return res.status(500).json({ message: "Something went wrong with the AI connection." });
        }

        const reply = data.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error("Server Error:", error.response?.data || error.message);
        res.status(500).json({ message: "I'm having a little trouble thinking right now. Mind trying again?" });
    }
});

module.exports = router;
