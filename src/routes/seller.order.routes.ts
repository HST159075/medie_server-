import express from "express";
import { checkRole } from "../middleware/role.middleware.js";
import { getSellerOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/",  checkRole(["SELLER"]), getSellerOrders);
router.patch("/:id",  checkRole(["SELLER"]), updateOrderStatus);

export default router;