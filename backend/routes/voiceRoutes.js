const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).json({ message: 'No transcript provided.' });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are Innerlift AI, an elite, empathetic AI performance coach. 
    The user is speaking to you via voice. They said: "${transcript}"
    Respond directly to them. 
    Rules: Keep it extremely concise (maximum 2 short sentences). Be motivating, calm, and actionable. Do NOT use markdown, bolding, lists, or emojis. Write purely in spoken-word text.`;

    const result = await model.generateContent(prompt);
    const audioText = result.response.text().trim();

    res.status(200).json({ reply: audioText });
  } catch (error) {
    console.error('Voice AI Error:', error);
    res.status(500).json({ message: 'Failed to process voice AI', error: error.message });
  }
});

module.exports = router;