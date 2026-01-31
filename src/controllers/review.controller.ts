import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const addReview = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { rating, comment, medicineId } = req.body;

    if (!req.user?.id) {
      return next(new AppError("Please login to provide a review", 401));
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        medicineId,
        customerId: req.user?.id,
      },
    });

    res.status(201).json(review);
  },
);
export const getMedicineReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

  
    if (typeof id !== "string") {
      return next(new AppError("Invalid Medicine ID", 400));
    }

    const reviews = await prisma.review.findMany({
      where: {
        medicineId: id, 
      },
      include: {
        customer: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  },
);
