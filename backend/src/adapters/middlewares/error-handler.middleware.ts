import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error.js";

export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message
    });
    return;
  }

  res.status(500).json({
    type: "INFRASTRUCTURE_ERROR",
    message: "internal server error"
  });
};
