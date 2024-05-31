const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Function to handle validation errors
const handleValidationError = (err, res) => {
  const errorObj = {};
  const errArray = Object.keys(err.errors);

  errArray.forEach(el => {
    errorObj[el] = err.errors[el].message;
  });

  res.status(err.statusCode).json({
    status: err.status,
    errors: errorObj,
    message: 'Validation error'
  });
};

// Function to handle duplicate key errors
const handleDuplicateError = (err, res) => {
  const field = Object.keys(err.keyPattern)[0];
  const errorObj = {};
  errorObj[field] = `${field} already exists!`;

  res.status(err.statusCode).json({
    status: err.status,
    errors: errorObj,
    message: 'Duplicate field value in database.'
  });
};

// Function to send error details in development environment
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
  });
};

// Function to send error details in production environment
const sendProdError = (err, res) => {
  // Operational errors are sent to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Programming or unknown errors are not sent to the client
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

  if (process.env.NODE_ENV.trim() === 'production') {
    // Clone the error object
    let error = Object.create(
      Object.getPrototypeOf(err),
      Object.getOwnPropertyDescriptors(err)
    );

    // Handle duplicate key errors
    if (err.code === 11000) {
      return handleDuplicateError(err, res);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return handleValidationError(err, res);
    }

    // Handle cast errors (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
      error = new AppError('Not found', 404);
    }

    // Handle JWT expired token error
    if (error.name === 'TokenExpiredError') {
      error = new AppError(
        'Token is not valid, or has expired. Login to get the token.',
        401
      );
    }

    // Send the error response in production
    return sendProdError(error, res);
  }

  // Send the error response in development
  sendDevError(err, res);
};
