const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  forgotpassword,
  resetPassword,
  getUserDashboard,
  updatePassword,
  updateUserProfile,
  adminUserDetails,
  adminGetUserSingleDetail,
} = require("../controllers/userController");
const { Authentication, customRole } = require("../middleware/auth");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/forgotpassword").post(forgotpassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userDashBoard").get(Authentication, getUserDashboard);
router.route("/password/updatePassword").post(Authentication, updatePassword);
router
  .route("/userDashboard/updateProfile")
  .post(Authentication, updateUserProfile);
router
  .route("/admin/userDetails")
  .get(Authentication, customRole("admin"), adminUserDetails);
router
  .route("/admin/userDetails/:id")
  .get(Authentication, customRole("admin"), adminGetUserSingleDetail);
module.exports = router;
