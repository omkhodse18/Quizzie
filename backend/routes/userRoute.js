const express = require('express');
const {
  getTrendings,
  getStats,
  getUsersPollsAndQuizzes
} = require('../controllers/userController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Route to get trending quizzes and polls, protected by authentication
router.get('/trendings', protect, getTrendings);

// Route to get statistics related to quizzes and polls, protected by authentication
router.get('/stats', protect, getStats);

// Route to get all quizzes and polls created by the user, protected by authentication
router.get('/pollsAndQuizzes', protect, getUsersPollsAndQuizzes);

module.exports = router;
