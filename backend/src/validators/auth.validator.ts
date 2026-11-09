import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

// Scaffold validator placeholder
export const validateLoginPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    ApiResponse.error(res, 'Email và mật khẩu là bắt buộc', 400);
    return;
  }
  next();
};

