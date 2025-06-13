const express = require('express');
const router = express.Router();
const { getProblemByName, getProblemsBySection } = require('../controllers/problemController');

// ✅ Specific route first
router.get('/section/:sectionName', getProblemsBySection);

// ✅ Generic route after
router.get('/:name', getProblemByName);

module.exports = router;