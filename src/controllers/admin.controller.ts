import {prisma} from "../lib/prisma";
import { Request, Response } from "express";

// Get all users
export const getUsers = async (req: Request, res:Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true }
  });
  res.json(users);
};

// Ban / Unban user
export const updateUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const user = await prisma.user.update({
    where: { id: req.params.id as string},
    data: { status }
  });

  res.json(user);
};

// View all orders
export const getAllOrders = async (req: Request, res:Response) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { medicine: true } }, customer: true }
  });
  res.json(orders);
}; 