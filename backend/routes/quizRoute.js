const express = require('express');
const {
  addQuiz,
  getQuiz,
  getUserQuizzes,
  deleteQuiz,
  attemptQuiz,
  updateQuiz
} = require('../controllers/quizController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Routes for handling quiz creation and retrieving user's quizzes
router
  .route('/')
  .post(protect, addQuiz)  // Protected route to add a new quiz
  .get(protect, getUserQuizzes);  // Protected route to get all quizzes created by the user

// Routes for handling specific quiz operations based on quiz ID
router
  .route('/:id')
  .get(getQuiz)  // Public route to get a specific quiz
  .patch(protect, updateQuiz)  // Protected route to update a specific quiz
  .delete(protect, deleteQuiz);  // Protected route to delete a specific quiz

// Route for attempting a quiz, identified by quiz ID
router.route('/attempt/:id').patch(attemptQuiz);

module.exports = router;
