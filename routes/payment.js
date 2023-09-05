const express = require("express");
const router = express.Router();
const {
  sendRazorpayKey,
  sendStripeKey,
  captureStripePayment,
  captureRazorpayPayment,
} = require("../controllers/paymentController");
const {Authentication } = require("../middleware/auth");

router.route("/stripekey").get(Authentication, sendStripeKey);
router.route("/razorpaykey").get(Authentication, sendRazorpayKey);

router.route("/capturestripe").post(Authentication, captureStripePayment);
router.route("/capturerazorpay").post(Authentication, captureRazorpayPayment);

module.exports = router;
