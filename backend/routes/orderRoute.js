const express = require("express");
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRole("admin") && authorizeRole("seller"), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRole("admin") && authorizeRole("seller"), updateOrder).delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);

module.exports = router;