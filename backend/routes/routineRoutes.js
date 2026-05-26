const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.get('/', protect, async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(routines);
  } catch (error) {
    console.error("Routine GET Error:", error);
    res.status(500).json({ message: "Server Error fetching routines" });
  }
});

router.post('/', protect, async (req, res) => {
  const { promptText } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an elite productivity and mindset coach for a high-performance system called InnerLift. 
    The user needs a highly structured, ruthless daily routine to maximize execution.
    
    User's Custom Instructions & Constraints: 
    "${promptText || 'General Deep Work'}"

    CRITICAL RULES:
    1. READ THE USER'S INSTRUCTIONS CAREFULLY.
    2. If the user specifies a start time (e.g., 8:00 AM), your schedule MUST begin at that exact time. Do not default to 6:00 AM.
    3. If the user mentions specific hours for classes, gym, or work, build the schedule around those anchor points.
    4. Keep the activity descriptions actionable but concise.

    Analyze this and generate a structured daily protocol. Respond ONLY with a valid JSON object exactly matching this structure:
    {
      "title": "A strong, tactical name for this routine",
      "philosophy": "A 2-sentence harsh but motivating philosophy for the day.",
      "blocks": [
        { "time": "08:00 AM", "activity": "Specific action", "type": "Execution | Recovery | Prep" }
      ]
    }
    Do not wrap the response in markdown code blocks. Return raw JSON only.`;

    const response = await model.generateContent(prompt);
    const rawText = response.response.text();
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const aiRoutineData = JSON.parse(cleanJson);

    const newRoutine = new Routine({
      user: req.user._id,
      title: aiRoutineData.title,
      philosophy: aiRoutineData.philosophy,
      blocks: aiRoutineData.blocks,
      rawInput: { focusArea: promptText }
    });

    const savedRoutine = await newRoutine.save();
    res.status(201).json(savedRoutine);

  } catch (error) {
    console.error("AI Routine Generation Failed:", error);
    res.status(500).json({
      message: "AI Systems currently offline. Could not generate protocol."
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine || routine.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Routine not found or unauthorized' });
    }

    await routine.deleteOne();
    res.json({ message: 'Routine purged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete routine' });
  }
});

module.exports = router;