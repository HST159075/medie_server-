import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { Session } from "inspector";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    console.log("Authorization Header:", req.headers.authorization);
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log("Session Data:", session);

    if (!session || !session.user) {
      console.log("Auth Failed: No session found")
      return res.status(401).json({
        success: false,
        message: "Unauthorized: সেশন পাওয়া যায়নি। দয়া করে লগইন করুন।",
      });
    }
    const user = session.user as any;
    console.log("User Role from Session:", user.role);
    if (user.status === false) {
      return res.status(403).json({
        success: false,
        message:
          "আপনার অ্যাকাউন্টটি স্থগিত করা হয়েছে।",
      });
    }
    (req as any).user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    (req as any).session = session.session;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Authentication",
    });
  }
  
};
