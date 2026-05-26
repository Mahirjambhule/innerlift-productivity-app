const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

mongoose.connect(process.env.MONGO_URI);
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_monochrome_key";
const PORT = process.env.PORT || 5000;

process.env.JWT_SECRET = JWT_SECRET;

// Middleware Parsers
app.use(cors());
app.use(express.json());

// Route Imports
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const gamificationRoutes = require('./routes/gamification');
const routineRoutes = require('./routes/routineRoutes');
const postRoutes = require('./routes/postRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Endpoint Mounting
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/tasks', taskRoutes);


mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server executing cleanly on port ${PORT}`));