import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://medistore-server.vercel.app",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
  },
  // লোকাল এবং লাইভ উভয় ডোমেইন এখানে রাখুন
  trustedOrigins: [
    "http://localhost:3000",
    "https://medistore-dusky.vercel.app",
  ],
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
      },
    },
  },
});
