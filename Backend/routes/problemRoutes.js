const express = require('express');
const router = express.Router();

const {
  getProblemByName,
  getProblemsBySection,
  getProblemsByDifficulty,
  getFilteredProblemsByParams
} = require('../controllers/problemController');

// ✅ Specific named routes
router.get('/byName/:name', getProblemByName);
router.get('/bySection/:sectionName', getProblemsBySection);
router.get('/byDifficulty/:difficultyLevel', getProblemsByDifficulty);

// ✅ Clean path-param based filtering (more specific routes listed first)
router.get('/filter/section/:section/title/:title/difficulty/:difficulty', getFilteredProblemsByParams);
router.get('/filter/section/:section/difficulty/:difficulty', getFilteredProblemsByParams);
router.get('/filter/section/:section/title/:title', getFilteredProblemsByParams);
router.get('/filter/title/:title/difficulty/:difficulty', getFilteredProblemsByParams);
router.get('/filter/section/:section', getFilteredProblemsByParams);
router.get('/filter/title/:title', getFilteredProblemsByParams);
router.get('/filter/difficulty/:difficulty', getFilteredProblemsByParams);

module.exports = router;
