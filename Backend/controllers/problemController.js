const Problem = require('../models/Problem');

// ✅ Get a single problem by exact title match
const getProblemByName = async (req, res) => {
  try {
    const name = req.params.name?.trim();
    if (!name) {
      return res.status(400).json({ message: 'Problem name is required' });
    }

    const problem = await Problem.find({ title: name });

    if (!problem.length) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching problem',
      error: error.message
    });
  }
};

// ✅ Get problems by section (case-insensitive)
const getProblemsBySection = async (req, res) => {
  try {
    const sectionName = req.params.sectionName?.trim();
    if (!sectionName) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const problems = await Problem.find({
      section: new RegExp(sectionName, 'i')
    });

    if (!problems.length) {
      return res.status(404).json({ message: 'No problems found in this section' });
    }

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching problems by section',
      error: error.message
    });
  }
};

// ✅ Get problems by difficulty (case-insensitive)
const getProblemsByDifficulty = async (req, res) => {
  try {
    const level = req.params.difficultyLevel?.trim();
    if (!level) {
      return res.status(400).json({ message: 'Difficulty level is required' });
    }

    const problems = await Problem.find({
      difficulty: new RegExp(`^${level}$`, 'i')
    });

    if (!problems.length) {
      return res.status(404).json({ message: 'No problems found for this difficulty' });
    }

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching problems by difficulty',
      error: error.message
    });
  }
};

// ✅ Path-param based filtering (title, difficulty, section in any combo)
const getFilteredProblemsByParams = async (req, res) => {
  try {
    const { title, difficulty, section } = req.params;
    const query = {};

    if (title?.trim()) {
      query.title = { $regex: title.trim(), $options: 'i' };
    }

    if (difficulty?.trim()) {
      query.difficulty = { $regex: difficulty.trim(), $options: 'i' };
    }

    if (section?.trim()) {
      query.section = { $regex: section.trim(), $options: 'i' };
    }

    const problems = await Problem.find(query).select('-testCases');

    if (!problems.length) {
      return res.status(404).json({ message: 'No matching problems found' });
    }

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching filtered problems',
      error: error.message
    });
  }
};

module.exports = {
  getProblemByName,
  getProblemsBySection,
  getProblemsByDifficulty,
  getFilteredProblemsByParams
};
