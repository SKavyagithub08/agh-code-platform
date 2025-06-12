const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getUserDashboard);

module.exports = router;
