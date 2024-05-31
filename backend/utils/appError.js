class AppError extends Error {
    constructor(message, statusCode) {
      // Call the constructor of the parent class (Error) with the message
      super(message);
      
      // Set the status code (default to 500 if not provided)
      this.statusCode = statusCode || 500;
  
      // Determine the status based on the status code
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      
      // Mark the error as operational (errors we can anticipate and handle gracefully)
      this.isOperational = true;
    }
  }
  
  module.exports = AppError;
  