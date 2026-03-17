"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_1 = require("../utils/ai");
const router = (0, express_1.Router)();
router.post('/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const chat = (0, ai_1.startChat)(history || []);
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        res.json({ text });
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        res.status(500).json({
            error: 'Failed to get response from AI',
            details: errorMessage
        });
    }
});
exports.default = router;
