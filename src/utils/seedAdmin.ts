import {prisma }from "../lib/prisma";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  const adminEmail = "admin@medistore.com";

  const exists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!exists) {
    const password = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password,
        role: "ADMIN",
      },
    });

    console.log("Admin seeded");
  }
};