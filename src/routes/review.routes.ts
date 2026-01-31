import express, { Handler } from "express";
import {
  addReview,
  getMedicineReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/medicine/:id", getMedicineReviews);

router.post("/", addReview);

export default router;
