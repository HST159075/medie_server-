import { number } from "better-auth/*";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

interface OrderItemInput {
  medicineId: string;
  quantity: number;
}

// ১. Create order with Transaction & Stock Update
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, address } = req.body;
    const customerId = req.user?.id as string;

    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) throw new Error(`ওষুধ (ID: ${item.medicineId}) পাওয়া যায়নি।`);
        if (medicine.stock < item.quantity) {
          throw new Error(`${medicine.name} পর্যাপ্ত স্টকে নেই।`);
        }

        const itemTotal = medicine.price * item.quantity;
        totalPrice += itemTotal;

       
        orderItemsToCreate.push({
          medicineId: medicine.id,
          quantity: item.quantity,
          price: medicine.price, 
        });

    
        await tx.medicine.update({
          where: { id: medicine.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return await tx.order.create({
        data: {
          customerId,
          totalPrice : Number(totalPrice),
          address,
          status: "PENDING",
          items: {
            create: orderItemsToCreate,
          },
        },
        include: { items: true },
      });
    });

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id as string;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { medicine: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "অর্ডার হিস্ট্রি পাওয়া যায়নি।" });
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: { items: { include: { medicine: true } }, customer: true },
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ message: "অর্ডারটি পাওয়া যায়নি।" });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.user?.id as string;
    const orders = await prisma.order.findMany({
      where: { items: { some: { medicine: { sellerId } } } },
      include: { items: { include: { medicine: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "সেলার অর্ডার লিস্ট পাওয়া যায়নি।" });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id as string;

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status code" });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ message: "স্ট্যাটাস আপডেট করা সম্ভব হয়নি।" });
  }
};