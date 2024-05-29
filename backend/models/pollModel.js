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
  },
  votes: {
    type: Number,
    default: 0 // Default vote count is zero
  }
});

// Schema for individual questions within a poll
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
  }
});

// Schema for the entire poll
const pollSchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'poll' // Default category is 'poll'
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

// Model for the Poll schema
module.exports = mongoose.model('Poll', pollSchema);
