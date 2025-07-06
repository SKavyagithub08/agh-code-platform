const Problem = require('../models/Problem');
const Section = require('../models/Section');

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      createdBy: req.user._id
    });
    const saved = await problem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating problem', error });
  }
};

// Update an existing problem
const updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating problem', error });
  }
};

// Delete a problem
const deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting problem', error });
  }
};

// Get all problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems', error });
  }
};

// Create a new section
const createSection = async (req, res) => {
  try{
    const { coverImage, name, companies, easyQuestions, mediumQuestions, hardQuestions } = req.body;

    // Validate the input
    if (!coverImage || !name || !companies || easyQuestions < 0 || mediumQuestions < 0 || hardQuestions < 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const noOfQuestions = easyQuestions + mediumQuestions + hardQuestions;

    const section = new Section({
      coverImage,
      name,
      companies,
      easyQuestions,
      mediumQuestions,
      hardQuestions,
      noOfQuestions
    });

    const savedSection = await section.save();
    res.status(201).json(savedSection);
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating section', error });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  createSection
};
