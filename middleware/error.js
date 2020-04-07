const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // Setting all errors var
  let error = { ...err };

  error.message = err.message;

  // Mongoose Bad ObjectID
  if (err.name === "CastError") {
    const message = `Resource Not Found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = `Duplicate Entry`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send back all Caught Errors or a 500 server error otherwise
  res
    .status(error.statusCode || 500)
    .json({ success: false, msg: error.message || `Server Error` });
};

module.exports = errorHandler;
