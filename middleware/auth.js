const jwt = require("jsonwebtoken");
const handler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect Route
exports.protect = handler(async (req, res, next) => {
  let token;

  // Check for auth token in headers or if in cookies(if accepted terms)
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ErrorResponse(`Not Authorized`, 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse(`Not Authorized`, 401));
  }
});

// Authorization Route based on role assigned from DB
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check for role assigned
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role: ${req.user.role} is unauthorized for this action`,
          403
        )
      );
    }
    next();
  };
};
