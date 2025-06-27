const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// Submit code for a problem
router.post('/submit/:id', protect, submitCode);

// Get all submissions for logged-in user
router.get('/user', protect, getUserSubmissions);

module.exports = router;
