const Submission = require('../models/Submission');

const submitCode = async (req, res) => {
  const { code, language } = req.body;
  const problemId = req.params.id;
  const userId = req.user._id;

  try {
   const submission = await Submission.create({
  user: userId,
  problem: problemId,
  code,
  language,
  verdict: 'Pending',
  submittedAt: new Date()
});


    res.status(201).json({ message: 'Submission saved', submission });
  } catch (error) {
    res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).populate('problemId', 'title');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};


module.exports = { submitCode, getUserSubmissions };
