const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema for User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Ensure that the name field is always provided
  },
  email: {
    type: String,
    required: true, // Ensure that the email field is always provided
    unique: true, // Ensure the email is unique
    validate: {
      validator: function(v) {
        // Validate email format using a regex pattern
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!` // Custom error message for invalid email
    }
  },
  password: {
    type: String,
    required: true, // Ensure that the password field is always provided
    minLength: 6 // Minimum length for the password
  },
  confirmPassword: {
    type: String,
    required: true, // Ensure that the confirmPassword field is always provided
    validate: {
      // Custom validator to check if password and confirmPassword match
      validator: function(val) {
        return this.password === val;
      },
      message: 'Passwords do not match' // Custom error message for mismatched passwords
    }
  }
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function(next) {
  // Hash the password with a cost factor of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Remove confirmPassword field from the database
  this.confirmPassword = undefined;

  next(); // Proceed to save the user
});

// Method to compare provided password with the stored hashed password
userSchema.method('comparePassword', async function(provided) {
  return await bcrypt.compare(provided, this.password);
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
