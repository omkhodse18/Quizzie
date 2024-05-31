const catchAsync = require('../utils/catchAsync');
const Quiz = require('../model/quizModel');
const Poll = require('../model/pollModel');

// Controller function to get trending quizzes and polls based on impressions
exports.getTrendings = catchAsync(async (req, res, next) => {
  // Fetch quizzes and polls created by the logged-in user
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  // Combine quizzes and polls into a single array
  const docs = [...quizzes, ...polls];

  // Sort the combined array based on impressions in descending order
  docs.sort((a, b) => b.impressions - a.impressions);

  // Respond with the sorted documents
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { docs }
  });
});

// Controller function to get statistics about quizzes and polls
exports.getStats = catchAsync(async (req, res, next) => {
  // Fetch quizzes and polls created by the logged-in user
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  // Initialize stats object
  const stats = {};
  stats.totalQuizzesAndPolls = quizzes.length + polls.length;

  // Calculate total number of questions in quizzes and polls
  let totalQuizzesQuestions = 0;
  let totalPollsQuestions = 0;

  quizzes.forEach(quiz => {
    totalQuizzesQuestions += quiz.questions.length;
  });

  polls.forEach(poll => {
    totalPollsQuestions += poll.questions.length;
  });

  stats.totalQuestions = totalPollsQuestions + totalQuizzesQuestions;

  // Calculate total impressions for quizzes and polls
  let totalPollImpressions = 0;
  let totalQuizImpressions = 0;

  quizzes.forEach(quiz => {
    totalQuizImpressions += quiz.impressions;
  });

  polls.forEach(poll => {
    totalPollImpressions += poll.impressions;
  });

  stats.totalImpressions = totalPollImpressions + totalQuizImpressions;

  // Respond with the calculated statistics
  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

// Controller function to get quizzes and polls created by the logged-in user, sorted by creation date
exports.getUsersPollsAndQuizzes = catchAsync(async (req, res, next) => {
  // Fetch quizzes and polls created by the logged-in user
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  // Combine quizzes and polls into a single array
  const userDocs = [...quizzes, ...polls];

  // Sort the combined array based on creation date in descending order
  const docs = userDocs.sort((a, b) => {
    const createdAtA = new Date(a.createdAt).getTime();
    const createdAtB = new Date(b.createdAt).getTime();
    return createdAtB - createdAtA;
  });

  // Log the sorted documents (for debugging purposes)
  console.log(docs);

  // Respond with the sorted documents
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { docs }
  });
});
