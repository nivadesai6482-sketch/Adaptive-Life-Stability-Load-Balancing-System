const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/chat
 * @desc    Get AI assistant response with system context
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    const { message, history } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;

    // Check for missing or placeholder keys
    if (!apiKey ||
        apiKey === 'your_key_here' ||
        apiKey === 'sk-xxxxxxxxxxxxxxxxxxxx' ||
        apiKey === 'sk-proj-xxxxxxxxxxxxxxxxxxxx') {

        console.error(`❌ OpenAI API_KEY is missing or invalid in environment variables`);
        return res.status(500).json({
            message: 'AI Assistant key not configured. Please add your OpenAI key to backend/.env.'
        });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
        apiKey: apiKey
    });

    try {
        console.log("🚀 Calling OpenAI directly with key:", `${apiKey.substring(0, 12)}...`);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a warm, human, supportive assistant for the Adaptive Life Stability System (ALS-LBS). Talk like a real person, avoid jargon, and prioritize emotional validation and gentle guidance."
                },
                ...(history || []),
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        console.log("OpenAI Response received");

        if (!response.choices || response.choices.length === 0) {
            console.error("OpenAI Error: No choices returned", response);
            return res.status(500).json({ message: "Something went wrong with the AI connection." });
        }

        const reply = response.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        if (error.response) {
            console.error("Status:", error.status);
            console.error("Data:", error.data);
        }
        res.status(500).json({ message: "I'm having a little trouble thinking right now. Mind trying again?" });
    }
});

module.exports = router;
