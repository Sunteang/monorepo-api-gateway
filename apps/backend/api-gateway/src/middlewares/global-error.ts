import { gatewayLogger } from "../server";
import { HTTP_STATUS_CODE } from "../utils/constants/status-code";
import { APP_ERROR_MESSAGE } from "../utils/constants/app-error-message";
import { ApplicationError } from "@/utils/error";
import { NextFunction, Request, Response } from "express";

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Error
  if (error instanceof ApplicationError) {
    const status = error.status;
    const message = error.message;
    const errors = error.errors;

    gatewayLogger.error(
      `$API Gateway - globalErrorHandler() method error: `,
      error
    );
    return res.status(status).json({ message, error: errors });
  }

  // Unhandle Error
  gatewayLogger.error(
    `$API Gateway - globalErrorHandler() unexpected method error: `,
    error as {}
  );
  res
    .status(HTTP_STATUS_CODE.SERVER_ERROR)
    .json({ message: APP_ERROR_MESSAGE.serverError });
}
