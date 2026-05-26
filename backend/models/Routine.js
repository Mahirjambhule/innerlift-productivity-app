const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    philosophy: {
        type: String,
        required: true
    },
    blocks: [{
        time: { type: String, required: true },
        activity: { type: String, required: true },
        type: { type: String, required: true }
    }],
    rawInput: {
        focusArea: String,
        wakeTime: String,
        energyLevel: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Routine', routineSchema);