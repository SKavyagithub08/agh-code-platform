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

// ✅ Get all problems by section (case-insensitive)
const getProblemsBySection = async (req, res) => {
  try {
    const sectionName = req.params.sectionName?.trim();
    if (!sectionName) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const problems = await Problem.find({
      section: new RegExp(sectionName, 'i')
    });

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching problems by section',
      error: error.message
    });
  }
};

// ✅ Filter problems by title, difficulty, section, and optional sort
const getFilteredProblems = async (req, res) => {
  try {
    const { title, difficulty, section, sort } = req.query;
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

    // Sorting logic
    let sortOption = {};
    if (sort === 'difficultyAsc') {
      sortOption.difficulty = 1;
    } else if (sort === 'difficultyDesc') {
      sortOption.difficulty = -1;
    }

    // 🔍 Debug log (remove in production)
    console.log('[Filtered Search] Query:', query, '| Sort:', sortOption);

    const problems = await Problem.find(query)
      .sort(sortOption)
      .select('-testCases'); // exclude testCases

    if (!problems.length) {
      return res.status(404).json({ message: 'No problems matched your filter.' });
    }

    res.status(200).json(problems);
  } catch (error) {
    console.error('Error filtering problems:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getProblemByName,
  getProblemsBySection,
  getFilteredProblems
};
