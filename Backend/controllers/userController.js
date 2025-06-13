const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

// 🧠 Helper function to update user streak
const updateUserStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
  if (lastSolved) lastSolved.setHours(0, 0, 0, 0);

  if (lastSolved && today.getTime() === lastSolved.getTime()) {
    // Already solved today
    return;
  } else if (lastSolved && today.getTime() - lastSolved.getTime() === 86400000) {
    // Continued streak
    user.currentStreak += 1;
  } else {
    // Streak broken or first time
    user.currentStreak = 1;
  }

  user.maxStreak = Math.max(user.maxStreak, user.currentStreak);
  user.lastSolvedDate = new Date();
  await user.save();
};

// ✅ Dashboard API
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user
    const user = await User.findById(userId).select('-password');

    // Fetch submissions
    const submissions = await Submission.find({ user: userId });

    // Stats
    const totalSubmissions = submissions.length;
    const accepted = submissions.filter(s => s.verdict === 'Accepted').length;
    const rejected = totalSubmissions - accepted;
    const attemptedProblems = [...new Set(submissions.map(s => s.problem.toString()))];

    res.json({
      user: {
        ...user.toObject(),
        streak: {
          currentStreak: user.currentStreak,
          maxStreak: user.maxStreak,
          lastSolvedDate: user.lastSolvedDate
        }
      },
      stats: {
        totalSubmissions,
        accepted,
        rejected,
        successRate: totalSubmissions ? (accepted / totalSubmissions * 100).toFixed(2) + '%' : '0%',
        problemsAttempted: attemptedProblems.length
      },
      recentSubmissions: submissions.slice(-5).reverse()
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
};

// ✅ Update streak on problem solve (called after an Accepted submission)
const markProblemAsSolved = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId, verdict } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (verdict === 'Accepted') {
      // Check if already solved
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
      }

      // Update streak
      await updateUserStreak(user);
    }

    res.status(200).json({ message: 'Submission processed, streak updated if accepted.' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to mark problem as solved', error: error.message });
  }
};

module.exports = {
  getUserDashboard,
  markProblemAsSolved
};
