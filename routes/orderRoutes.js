const express = require("express");
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  admingetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const {  Authentication, customRole } = require("../middleware/auth");

router.route("/order/create").post(Authentication, createOrder);
router.route("/order/:id").get(Authentication, getOneOrder);
router.route("/myorder").get(Authentication, getLoggedInOrders);

//admin routes
router
  .route("/admin/orders")
  .get(Authentication, customRole("admin"), admingetAllOrders);
router
  .route("/admin/order/:id")
  .put(Authentication, customRole("admin"), adminUpdateOrder)
  .delete(Authentication, customRole("admin"), adminDeleteOrder);

module.exports = router;
