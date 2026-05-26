const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// 1. THE PENALTY ROUTE
router.post('/reset', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          xp: 0,
          streak: 0,
          level: 1,
          lastActiveDate: null
        }
      },
      { returnDocument: 'after', strict: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found for reset" });
    }

    res.json({ xp: updatedUser.xp, streak: updatedUser.streak, level: updatedUser.level });
  } catch (error) {
    console.error("Failed to execute database reset:", error);
    res.status(500).json({ message: "Server error during penalty reset" });
  }
});

router.post('/update-xp', protect, async (req, res) => {
  try {
    const { xpActionType } = req.body;
    let xpToAdd = 0;

    if (xpActionType === 'pomodoro') xpToAdd = 30;
    else if (xpActionType === 'journal') xpToAdd = 10;
    else if (xpActionType === 'task') xpToAdd = 5;

    const user = await User.findById(req.user._id).lean();

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveDb = user.lastActiveDate;

    let currentStreak = user.streak || 0;

    if (lastActiveDb !== todayStr) {
      currentStreak += 1;
    }

    let newXp = (user.xp || 0) + xpToAdd;
    let newLevel = user.level || 1;

    while (newXp >= 100) {
      newXp -= 100;
      newLevel += 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          xp: newXp,
          level: newLevel,
          streak: currentStreak,
          lastActiveDate: todayStr
        }
      },
      { returnDocument: 'after', strict: false }
    );

    res.json({
      xp: updatedUser.xp,
      level: updatedUser.level,
      streak: updatedUser.streak
    });

  } catch (error) {
    console.error("Failed to update XP:", error);
    res.status(500).json({ message: "Server error during XP update" });
  }
});

module.exports = router;