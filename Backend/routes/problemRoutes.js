const express = require('express');
const router = express.Router();
const {
  getProblemByName,
  getProblemsBySection,
  getFilteredProblems
} = require('../controllers/problemController');

router.get('/name/:name', getProblemByName);
router.get('/section/:sectionName', getProblemsBySection);
router.get('/filter', getFilteredProblems); // ✅ important

module.exports = router;