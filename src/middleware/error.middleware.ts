import { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status || "error",
    message: err.message,
  });
};
