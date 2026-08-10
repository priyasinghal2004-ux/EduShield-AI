const express = require("express");
const { generateChatResponse } = require("../services/gemini.service");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }

        const reply = await generateChatResponse(
            message.trim(),
            Array.isArray(history) ? history : []
        );

        res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Chat route error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to connect to EduShield AI right now.",
        });
    }
});

module.exports = router;