import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.APP_URL as string],
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
