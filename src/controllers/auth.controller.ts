import {prisma }from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["CUSTOMER", "SELLER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password as string);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};