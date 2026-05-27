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

    const prompt = `System Instructions:
    You are InnerLift AI, an elite, highly focused performance and life coach.
    - BE DIRECT & ACTIONABLE: Give thoughtful advice and immediately stop.
    - ZERO FLUFF: No conversational filler or trailing questions.
    - LENGTH: Strictly 3 to 6 sentences.
    - FORMAT: No markdown, asterisks, or emojis. Plain text only.

    User Input: "${transcript}"

    Your Response:`;

    const result = await model.generateContent(prompt);
    const audioText = result.response.text().trim();

    res.status(200).json({ reply: audioText });
  } catch (error) {
    console.error('Voice AI Error:', error);
    res.status(500).json({ message: 'Failed to process voice AI', error: error.message });
  }
});

module.exports = router;