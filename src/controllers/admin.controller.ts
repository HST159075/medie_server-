import {prisma} from "../lib/prisma";
import { Request, Response } from "express";


export const getUsers = async (req: Request, res:Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true }
  });
  res.json(users);
};


export const updateUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const user = await prisma.user.update({
    where: { id: req.params.id as string},
    data: { status }
  });

  res.json(user);
};


export const getAllOrders = async (req: Request, res:Response) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { medicine: true } }, customer: true }
  });
  res.json(orders);
}; 