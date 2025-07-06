const express = require('express');
const router = express.Router();
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
    createSection
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/problem', protect, isAdmin, createProblem);
router.put('/problem/:id', protect, isAdmin, updateProblem);
router.delete('/problem/:id', protect, isAdmin, deleteProblem);
router.get('/problems', protect, isAdmin, getAllProblems);
router.post('/section', protect, isAdmin, createSection);

module.exports = router;
