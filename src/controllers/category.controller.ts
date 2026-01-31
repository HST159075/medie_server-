import {prisma} from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";

export const createCategory = catchAsync(async (req: Request, res:Response) => {
  const category = await prisma.category.create({
    data: { name: req.body.name },
  });

  res.status(201).json(category);
});

export const getCategories = catchAsync(async (req: Request, res:Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

export const updateCategory = catchAsync(async (req: Request, res:Response, next: NextFunction) => {
  const category = await prisma.category.update({
    where: { id: req.params.id as string },
    data: { name: req.body.name },
  });

  if (!category) return next(new AppError("Category not found", 404));

  res.json(category);
});

export const deleteCategory = catchAsync(async (req: Request, res:Response) => {
  await prisma.category.delete({
    where: { id: req.params.id as string },
  });

  res.json({ message: "Deleted" });
});