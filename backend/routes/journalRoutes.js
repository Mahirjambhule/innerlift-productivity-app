const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Journal = require('../models/Journal');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching journals' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this entry' });
    }

    await entry.deleteOne();
    res.json({ message: 'Entry removed successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

router.post('/', protect, async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ message: 'Journal content is required' });

  let analysisResult = null;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an elite mindset and productivity coach. The user is submitting a raw, unfiltered journal entry. Your goal is to analyze their emotional state and provide structured, actionable advice to optimize their mental clarity and daily execution.
    
    Analyze the text and respond ONLY with a valid JSON object matching this exact structure:
    {
      "mood": "A 1-3 word description of their state",
      "sentimentScore": <A number between 0.0 and 1.0>,
      "emotionalReflection": "A 2-sentence empathetic validation of exactly how they are feeling right now.",
      "productivityInsight": "A 1-sentence insight on how their current mental state is affecting their ability to execute or focus.",
      "actionableSteps": [
        "A specific, immediate action they can take right now to reset or capitalize on their state.",
        "A secondary micro-habit or mindset shift to apply to the rest of their day."
      ]
    }
    Do not include markdown wraps or anything outside the raw JSON text block. 
    Entry: "${content}"`;

    const response = await model.generateContent(prompt);
    const cleanJson = response.response.text().replace(/```json|```/g, '').trim();
    analysisResult = JSON.parse(cleanJson);

  } catch (error) {
    console.error('❌ LIVE GEMINI API ERROR:', error.message);
    analysisResult = {
      mood: 'Reflective',
      sentimentScore: 0.50,
      emotionalReflection: 'System baseline logged locally. The AI coach is currently offline.',
      productivityInsight: 'Focus on immediate tasks until the connection is restored.',
      actionableSteps: ['Check your API connection.', 'Keep executing on your daily objectives.']
    };
  }

  try {
    const newJournalEntry = new Journal({
      userId: req.user._id,
      content,
      analysis: analysisResult,
      date: new Date()
    });

    const savedEntry = await newJournalEntry.save();

    res.json(savedEntry);
  } catch (dbError) {
    console.error('Database Error:', dbError);
    res.status(500).json({ message: 'Internal Server Error saving record.' });
  }
});

module.exports = router;