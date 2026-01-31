import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware.js";
import {
  createMedicine,
  updateMedicine,
  deleteMedicine
} from "../controllers/medicine.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, checkRole(["SELLER"]), createMedicine);
router.put("/:id", isAuthenticated, checkRole(["SELLER"]), updateMedicine);
router.delete("/:id", isAuthenticated, checkRole(["SELLER"]), deleteMedicine);

export default router;