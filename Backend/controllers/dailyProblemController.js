const DailyProblem = require('../models/DailyProblem');
const Problem = require('../models/Problem');

// Create or update the daily problem cycle
const createDailyCycle = async (req, res) => {
  try {
    const { problemIds, startDate } = req.body;

    // Try to find an existing daily problem cycle (assume only one should exist)
    let cycle = await DailyProblem.findOne();

    if (cycle) {
      // Append new problems (avoid duplicates)
      const existingIds = cycle.problems.map(p => p.toString());
      const newUniqueIds = problemIds.filter(id => !existingIds.includes(id));

      cycle.problems = [...existingIds, ...newUniqueIds];

      // Optional: update startDate (comment out if you don't want to reset)
      cycle.startDate = new Date(startDate);

      const updated = await cycle.save();
      return res.status(200).json({ message: 'Daily cycle updated', cycle: updated });
    }

    // If no cycle exists, create a new one
    const newCycle = new DailyProblem({
      problems: problemIds,
      startDate: new Date(startDate),
    });

    const saved = await newCycle.save();
    res.status(201).json({ message: 'New daily cycle created', cycle: saved });

  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating daily cycle', error });
  }
};

// Get today's problem based on the cycle
const getTodaysProblem = async (req, res) => {
  try {
    const cycle = await DailyProblem.findOne().sort({ createdAt: -1 }).populate('problems');

    if (!cycle || cycle.problems.length === 0) {
      return res.status(404).json({ message: 'No active cycle or problems found' });
    }

    const daysSinceStart = Math.floor(
      (new Date() - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24)
    );

    const index = daysSinceStart % cycle.problems.length;

    res.json(cycle.problems[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s problem', error });
  }
};

module.exports = {
  createDailyCycle,
  getTodaysProblem
};
