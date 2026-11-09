import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Scaffold middleware: Skeleton for JWT authentication
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Chưa đăng nhập hoặc thiếu token xác thực', 401);
    return;
  }

  // Authentication logic placeholder
  next();
};

// Scaffold middleware: Skeleton for Role-based Authorization
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      ApiResponse.error(res, 'Không có quyền truy cập tài nguyên này', 403);
      return;
    }
    next();
  };
};

