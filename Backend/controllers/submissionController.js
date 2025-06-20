const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateUserStreak = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Only add to solvedProblems if not already added
  if (!user.solvedProblems.includes(problemId)) {
    user.solvedProblems.push(problemId);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
  if (lastSolved) lastSolved.setHours(0, 0, 0, 0);

  if (lastSolved && today.getTime() === lastSolved.getTime()) {
    // Already solved today – don't increment streak again
    await user.save(); // save solvedProblems if newly added
    return;
  }

  if (lastSolved && today.getTime() - lastSolved.getTime() === 86400000) {
    user.currentStreak += 1; // continued streak
  } else {
    user.currentStreak = 1; // new streak
  }

  user.maxStreak = Math.max(user.maxStreak, user.currentStreak);
  user.lastSolvedDate = new Date();
  await user.save();
};

const submitCode = async (req, res) => {
  const { code, language } = req.body;
  const problemId = req.params.id;
  const userId = req.user._id;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const languageId = languageMap[language?.toLowerCase()];
    if (!languageId) return res.status(400).json({ message: 'Unsupported language' });

    const testCases = problem.testCases || [];
    let testResults = [];
    let allPassed = true;

    for (const test of testCases) {
      const response = await axios.post(
        `${JUDGE0_API}?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: test.input,
          expected_output: test.expectedOutput
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const result = response.data;
      let verdict = 'Wrong Answer';

      if (result.status.description === 'Accepted') {
        verdict = 'Accepted';
      } else if (result.status.description === 'Time Limit Exceeded') {
        verdict = 'Time Limit Exceeded';
      } else if (result.compile_output) {
        verdict = 'Compilation Error';
      } else if (result.stderr) {
        verdict = 'Runtime Error';
      }

      if (verdict !== 'Accepted') allPassed = false;

      testResults.push({
        input: test.input,
        expected: test.expectedOutput,
        output: result.stdout || result.compile_output || result.stderr || '',
        time: result.time || '',
        memory: result.memory || '',
        verdict
      });

      await sleep(1000); // Avoid rate limit
    }

    const overallVerdict = allPassed ? 'Accepted' : 'Wrong Answer';

    // ✅ Update solvedProblems and streak
    if (overallVerdict === 'Accepted') {
      await updateUserStreak(userId, problemId);
    }

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: overallVerdict,
      output: JSON.stringify(testResults),
      time: '',
      memory: ''
    });

    return res.status(201).json({
      message: 'Submission processed',
      overallVerdict,
      testResults,
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Error in submitCode:', error);
    return res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

module.exports = { submitCode, getUserSubmissions };
