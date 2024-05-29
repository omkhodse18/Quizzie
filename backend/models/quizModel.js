const mongoose = require('mongoose');
const validator = require('validator');

// Schema for individual options within a question
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true // Ensure that the text field is always provided
  },
  image: {
    type: String,
    validate: [validator.isURL, 'Enter a valid URL'] // Validate that the image field, if provided, is a valid URL
  }
});

// Schema for individual questions within a quiz
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true // Ensure that the question field is always provided
  },
  optionsType: {
    type: String,
    enum: ['text', 'image', 'textAndImage'], // Only allow these specific values
    required: true // Ensure that the optionsType field is always provided
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function(options) {
        return options.length > 1 && options.length <= 4; // Ensure between 2 and 4 options
      },
      message: 'Minimum two options required. Max is four.'
    },
    required: true // Ensure that the options field is always provided
  },
  answer: {
    type: Number,
    required: true, // Ensure that the answer field is always provided
    default: 0
  },
  attempts: {
    type: Number,
    default: 0 // Default number of attempts is zero
  },
  corrects: {
    type: Number,
    default: 0 // Default number of correct answers is zero
  }
});

// Schema for the entire quiz
const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'quiz' // Default category is 'quiz'
  },
  name: {
    type: String,
    required: true // Ensure that the name field is always provided
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(value) {
        return value.length > 0 && value.length <= 5; // Ensure between 1 and 5 questions
      },
      message: 'Minimum one question required. Max is five.'
    },
    required: true // Ensure that the questions field is always provided
  },
  timer: {
    type: Number,
    default: null // Default timer is null, meaning no timer by default
  },
  createdAt: {
    type: Date,
    default: Date.now // Default to the current date and time
  },
  impressions: {
    type: Number,
    default: 0 // Default impressions count is zero
  },
  createdBy: {
    type: mongoose.ObjectId,
    required: true // Ensure that the createdBy field is always provided
  }
});

// Create and export the Quiz model
module.exports = mongoose.model('Quiz', quizSchema);
