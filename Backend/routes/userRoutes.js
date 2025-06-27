const express = require('express');
const router = express.Router();
const { getUserDashboard, markProblemAsSolved } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getUserDashboard);
router.post('/solve', protect, markProblemAsSolved); // This now works

module.exports = router;
