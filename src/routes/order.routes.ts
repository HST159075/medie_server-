import express from "express";
import { checkRole } from "../middleware/role.middleware.js";
import { createOrder, getOrders, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/",  checkRole(["CUSTOMER"]), createOrder);
router.get("/",  checkRole(["CUSTOMER"]), getOrders);
router.get("/:id",  checkRole(["CUSTOMER"]), getOrderById);

export default router;