const express = require('express');
const router = express.Router();
const { getProblemById, getProblemsBySection } = require('../controllers/problemController');

// Get a problem by ID
router.get('/:id', getProblemById);

// Optional: Get all problems under a section
router.get('/section/:sectionName', getProblemsBySection);

module.exports = router;
