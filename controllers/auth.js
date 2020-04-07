const User = require("../models/User");
const handler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// function to clean up response status data
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwt();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Adding secure flags if in Production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

//@route    POST /api/v1/auth/register
//@desc     Register User
//@access   Public
exports.register = handler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//@route    POST /api/v1/auth/login
//@desc     Login User
//@access   Public
exports.login = handler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if body is filled
  if (!email || !password) {
    return next(
      new ErrorResponse(`Please enter a valid email and password`, 400)
    );
  }

  // Check if User exists with email and passowrd
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }

  // Verify Password
  const isMatched = await user.matchPassword(password);
  if (!isMatched) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

//@route    GET /api/v1/auth/me
//@desc     Logged in Users profile
//@access   Private
exports.getMe = handler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({ success: true, data: user });
});
