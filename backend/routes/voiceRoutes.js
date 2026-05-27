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

    const prompt = `You are InnerLift AI, an elite, highly focused performance and life coach. 
    The user is speaking to you via voice. They said: "${transcript}"
    
    Rules for your response:
    - BE DIRECT & ACTIONABLE: Give thoughtful, precise advice or insight, and then immediately stop.
    - ZERO FLUFF: Do NOT add closing pleasantries, conversational filler, or trailing questions (e.g., never say "How does that sound?", "Let me know...", or "I hope this helps").
    - LENGTH: Keep it strictly between 3 to 6 sentences. Hit the main point hard and fast without rambling.
    - FORMAT (CRITICAL): Do NOT use any markdown, asterisks, bolding, numbered lists, bullet points, or emojis. Write purely in plain, conversational spoken-word text. Use natural phrasing, commas, and periods so the text-to-speech engine sounds human.`;

    const result = await model.generateContent(prompt);
    const audioText = result.response.text().trim();

    res.status(200).json({ reply: audioText });
  } catch (error) {
    console.error('Voice AI Error:', error);
    res.status(500).json({ message: 'Failed to process voice AI', error: error.message });
  }
});

module.exports = router;