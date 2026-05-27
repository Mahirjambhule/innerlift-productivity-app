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

    const prompt = `You are InnerLift AI, an elite, empathetic, and highly actionable performance and life coach. 
    The user is speaking to you via voice. They said: "${transcript}"
    Respond directly to them. 
    
    Rules for your response:
    - Provide a thoughtful, highly actionable, and insightful answer.
    - LENGTH LIMIT: Keep your response strictly between 4 to 8 sentences (roughly 10 to 15 lines of spoken text). Do not ramble.
    - Maintain a warm, motivating, and highly professional tone.
    - CRITICAL: Do NOT use any markdown, asterisks, bolding, numbered lists, bullet points, or emojis. Write purely in conversational, plain spoken-word text. Use natural phrasing, commas, and periods so the text-to-speech engine sounds human.`;

    const result = await model.generateContent(prompt);
    const audioText = result.response.text().trim();

    res.status(200).json({ reply: audioText });
  } catch (error) {
    console.error('Voice AI Error:', error);
    res.status(500).json({ message: 'Failed to process voice AI', error: error.message });
  }
});

module.exports = router;