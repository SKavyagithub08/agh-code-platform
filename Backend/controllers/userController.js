const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user info
    const user = await User.findById(userId).select('-password');

    // Fetch submissions
    const submissions = await Submission.find({ user: userId });

    // Stats
    const totalSubmissions = submissions.length;
    const accepted = submissions.filter(s => s.verdict === 'Accepted').length;
    const rejected = totalSubmissions - accepted;
    const attemptedProblems = [...new Set(submissions.map(s => s.problem.toString()))];

    res.json({
      user,
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

module.exports = { getUserDashboard };
