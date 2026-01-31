import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

export const addMedicine = catchAsync(async (req: any, res: Response) => {
  const medicine = await prisma.medicine.create({
    data: {
      ...req.body,
      sellerId: req.user?.id as string,
    },
  });

  res.status(201).json(medicine);
});

export const updateMedicine = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
    });

    if (!medicine) return next(new AppError("Medicine not found", 404));

    if (medicine.sellerId !== req.user.id)
      return next(new AppError("Not your medicine", 403));

    const updated = await prisma.medicine.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  },
);

export const deleteMedicine = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
    });

    if (!medicine) return next(new AppError("Medicine not found", 404));

    if (medicine.sellerId !== req.user?.id)
      return next(new AppError("Not your medicine", 403));

    await prisma.medicine.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Deleted successfully" });
  },
);

export const getSellerOrders = catchAsync(async (req: any, res: Response) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId: req.user.id },
        },
      },
    },
    include: { items: true },
  });

  res.json(orders);
});

export const updateOrderStatus = catchAsync(async (req: any, res: Response) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  });

  res.json(order);
});
