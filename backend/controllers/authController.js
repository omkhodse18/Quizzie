const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Function to generate a JWT token
const getToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

// Login function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and if password matches
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Email or password is incorrect', 400));
  }

  // Generate token for the user
  const token = getToken({ id: user.id });

  // Send response with token
  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

// Register function
exports.register = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword
  });

  // Send response with the created user data
  res.status(200).send({
    message: 'Success',
    data: { user }
  });
});

// Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // Check if authorization header is present
  if (!req.headers.authorization) {
    return next(
      new AppError('You are not authorized to access this resource.', 403)
    );
  }

  // Extract token from authorization header
  const token = req.headers.authorization.split(' ')[1];

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Find user by decoded token ID
  const user = await User.findOne({ _id: decoded.id });

  // Check if user exists
  if (!user) {
    return next(new AppError('User not found', 400));
  }

  // Attach user to request object
  req.user = user;

  // Proceed to next middleware
  next();
});
