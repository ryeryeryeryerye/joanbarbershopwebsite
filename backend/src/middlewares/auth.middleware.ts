import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';
import { ENV } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// Middleware xác thực JWT
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

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    ApiResponse.error(res, 'Token không hợp lệ hoặc đã hết hạn', 401);
  }
};

// Middleware phân quyền theo Role
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      ApiResponse.error(res, 'Không có quyền truy cập tài nguyên này', 403);
      return;
    }
    next();
  };
};

