const express = require('express');
const router = express.Router();
const { createDailyCycle, getTodaysProblem } = require('../controllers/dailyProblemController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, createDailyCycle); // Admin creates cycle
router.get('/today', getTodaysProblem); // Anyone can fetch today's problem

module.exports = router;
