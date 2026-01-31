import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: false,
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
