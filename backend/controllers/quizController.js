const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Quiz = require('../model/quizModel');

// Controller function to add a new quiz
exports.addQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;

  const quiz = await Quiz.create({
    name,
    questions,
    timer,
    createdBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: { quiz }
  });
});

// Controller function to retrieve a quiz by ID
exports.getQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new AppError('Quiz does not exist', 404));
  }

  quiz.impressions += 1;
  await quiz.save();

  res.status(200).json({
    status: 'success',
    data: { quiz }
  });
});

// Controller function to retrieve quizzes created by the logged-in user
exports.getUserQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });

  res.status(200).json({
    status: 'success',
    results: quizzes.length,
    data: { quizzes }
  });
});

// Controller function to delete a quiz by ID
exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quiz = await Quiz.findOneAndDelete({
    _id: id,
    createdBy: req.user._id
  });

  if (!quiz) {
    return next(
      new AppError(
        "No quiz found with this id, or you don't have permission to delete it.",
        404
      )
    );
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Controller function to attempt a quiz and calculate the results
exports.attemptQuiz = catchAsync(async (req, res, next) => {
  const { results } = req.body;
  let corrects = 0;

  if (!results) {
    return next(new AppError('Please provide results', 400));
  }

  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new AppError('Could not find quiz', 404));
  }

  results.forEach(el => {
    // eslint-disable-next-line eqeqeq
    const question = quiz.questions.find(q => q._id == el.questionId);

    if (!question) {
      return next(new AppError('Question not found', 400));
    }

    question.attempts += 1;

    // eslint-disable-next-line eqeqeq
    if (el.selectedOption == question.answer) {
      corrects += 1;
      question.corrects += 1;
    }
  });

  await quiz.save();

  const userResults = {
    totalQuestions: quiz.questions.length,
    corrects
  };

  res.status(200).json({
    status: 'success',
    data: { userResults }
  });
});

// Controller function to update a quiz by ID
exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;
  const { id } = req.params;

  const quiz = await Quiz.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id
    },
    { name, questions, timer },
    { new: true }
  );

  if (!quiz) {
    return next(
      new AppError("Quiz not found, or you don't have permission to edit it", 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: { quiz }
  });
});
