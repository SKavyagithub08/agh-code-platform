const Problem = require('../models/Problem');

const getProblemByName = async (req, res) => {
  try {
    const problem = await Problem.find({ title: req.params.name });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem', error: error.message });
  }
};


const getProblemsBySection = async (req, res) => {
  try {
    const problems = await Problem.find({ section: req.params.sectionName });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems', error: error.message });
  }
};

module.exports = { getProblemByName, getProblemsBySection };
