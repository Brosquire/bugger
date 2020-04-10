const request = require("request");
const handler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

const Profile = require("../models/Profile");
const User = require("../models/User");

//@route    POST /api/v1/auth/profile
//@desc     Create profile for logged in user
//@access   Private / Admin
exports.createUserProfile = handler(async (req, res, next) => {
  req.body.user = req.user.id;

  const profile = await Profile.findOne({ user: req.user.id });
  // checks for duplicate profile entry
  if (profile && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User: ${req.user.id} already has a profile : Unauthorized for this action`,
        401
      )
    );
  }
  const newProfile = await Profile.create(req.body);
  return res.status(200).json({ success: true, data: newProfile });
});

//@route    PUT /api/v1/auth/profile/:id
//@desc     Update profile for logged in user
//@access   Private / Admin
exports.updateUserProfile = handler(async (req, res, next) => {
  let updateProfile = await Profile.findById(req.params.id);

  // check if profile is found/exists
  if (!updateProfile) {
    return next(
      new ErrorResponse(`No Profile found by id: ${req.params.id}`, 404)
    );
  }

  // validate user for current user or ADMIN
  if (
    updateProfile.user.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User id: ${req.user.id} is not Authorized for this action`,
        401
      )
    );
  }

  // update profile
  updateProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, data: updateProfile });
});

//@route    DELETE /api/v1/auth/profile/:id
//@desc     Delete profile for logged in user
//@access   Private / Admin
exports.deleteUser = handler(async (req, res, next) => {
  const deleteUserProfile = await User.findById(req.user.id);

  if (!deleteUserProfile) {
    return next(new ErrorResponse(`Profile not found: ${req.params.id}`, 404));
  }

  if (deleteUserProfile.id !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User: ${req.user.id} is not Authorized for this Action: Delete Profile`,
        401
      )
    );
  }

  await deleteUserProfile.remove();
  return res.status(200).json({ success: true, data: {} });
});

//@route    GET /api/v1/auth/profile/:id
//@desc     Get Single user profile
//@access   Private / Admin
exports.getProfile = handler(async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id).populate({
      path: "user",
      select: "name",
    });

    if (!profile) {
      return next(new ErrorResponse("Profile Not Found", 404));
    }

    return res.json(profile);
  } catch (error) {
    if (error) {
      console.error(error);
    }
    return res.status(500).json({ msg: "Serever Error" });
  }
});
