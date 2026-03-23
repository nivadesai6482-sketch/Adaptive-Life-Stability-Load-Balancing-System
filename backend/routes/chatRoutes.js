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

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
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
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = response.data;

        if (!data.choices) {
            console.error("OpenAI Error:", data);
            return res.json({ reply: "Something went wrong. Check backend logs." });
        }

        const reply = data.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error("Server Error:", error.response?.data || error);
        res.json({ reply: "Server error. Check backend logs." });
    }
});

module.exports = router;
