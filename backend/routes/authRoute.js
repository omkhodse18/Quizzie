const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

// Route for handling unauthorized access to the root of the auth routes
router.get('/', (req, res) => res.sendStatus(403));

// Route for user login
router.post('/login', login);

// Route for user registration
router.post('/register', register);

module.exports = router;
