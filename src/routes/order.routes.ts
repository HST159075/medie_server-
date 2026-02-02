import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, checkRole(["CUSTOMER"]), createOrder);

router.get("/", isAuthenticated, checkRole(["CUSTOMER"]), getOrders);
router.get("/seller", isAuthenticated, checkRole(["SELLER"]), getSellerOrders);
router.get("/:id", isAuthenticated, getOrderById);

router.patch(
  "/:id/status",
  isAuthenticated,
  checkRole(["SELLER", "ADMIN"]),
  updateOrderStatus,
);

export default router;
