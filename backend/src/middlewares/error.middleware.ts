import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Unhandle error: ${err.message}`, err.stack);

  if (err instanceof ApiError) {
    ApiResponse.error(res, err.message, err.statusCode);
    return;
  }

  ApiResponse.error(res, 'Lỗi máy chủ nội bộ (Internal Server Error)', 500);
};

