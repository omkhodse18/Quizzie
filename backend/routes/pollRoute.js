const express = require('express');
const {
  getPoll,
  addPoll,
  getUsersPolls,
  deletePoll,
  updatePoll,
  attemptPoll
} = require('../controllers/pollController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Routes for handling poll creation and retrieving user's polls
router
  .route('/')
  .post(protect, addPoll)  // Protected route to add a new poll
  .get(protect, getUsersPolls);  // Protected route to get all polls created by the user

// Routes for handling specific poll operations based on poll ID
router
  .route('/:id')
  .get(getPoll)  // Public route to get a specific poll
  .patch(protect, updatePoll)  // Protected route to update a specific poll
  .delete(protect, deletePoll);  // Protected route to delete a specific poll

// Route for attempting a poll, identified by poll ID
router.route('/attempt/:id').patch(attemptPoll);

module.exports = router;
