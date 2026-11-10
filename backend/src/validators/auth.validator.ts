import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

// Validate đăng ký: Họ tên, SĐT, Mật khẩu, Xác nhận mật khẩu
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, phone, password, confirmPassword } = req.body;

  if (!name || !name.trim()) {
    ApiResponse.error(res, 'Họ và tên là bắt buộc', 400);
    return;
  }
  if (!phone || !phone.trim()) {
    ApiResponse.error(res, 'Số điện thoại là bắt buộc', 400);
    return;
  }
  // Kiểm tra định dạng SĐT Việt Nam (10 số, bắt đầu bằng 0)
  const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!phoneRegex.test(phone.trim())) {
    ApiResponse.error(res, 'Số điện thoại không hợp lệ (phải là SĐT Việt Nam 10 số)', 400);
    return;
  }
  if (!password || password.length < 6) {
    ApiResponse.error(res, 'Mật khẩu phải có ít nhất 6 ký tự', 400);
    return;
  }
  if (!confirmPassword) {
    ApiResponse.error(res, 'Vui lòng xác nhận mật khẩu', 400);
    return;
  }
  if (password !== confirmPassword) {
    ApiResponse.error(res, 'Xác nhận mật khẩu không khớp', 400);
    return;
  }
  next();
};

// Validate đăng nhập: SĐT và Mật khẩu
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { phone, password } = req.body;
  if (!phone || !phone.trim()) {
    ApiResponse.error(res, 'Số điện thoại là bắt buộc', 400);
    return;
  }
  if (!password) {
    ApiResponse.error(res, 'Mật khẩu là bắt buộc', 400);
    return;
  }
  next();
};

