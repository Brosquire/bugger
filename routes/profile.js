const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getProfile,
  createUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/profile");

const router = express.Router();

router.use(protect);
//router.use(authorize("admin"));

router.route("/").post(createUserProfile);

router.route("/:id").get(getProfile).put(updateUserProfile).delete(deleteUser);

module.exports = router;
