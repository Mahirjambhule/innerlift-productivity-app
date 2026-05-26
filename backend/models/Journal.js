const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  analysis: {
    mood: { type: String, default: 'Reflective' },
    sentimentScore: { type: Number, default: 0.5 },
    emotionalReflection: { type: String },
    productivityInsight: { type: String },
    actionableSteps: { type: [String] }
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);