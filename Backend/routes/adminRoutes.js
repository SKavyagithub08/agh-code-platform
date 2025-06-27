const express = require('express');
const router = express.Router();
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/problem', protect, isAdmin, createProblem);
router.put('/problem/:id', protect, isAdmin, updateProblem);
router.delete('/problem/:id', protect, isAdmin, deleteProblem);
router.get('/problems', protect, isAdmin, getAllProblems);

module.exports = router;
