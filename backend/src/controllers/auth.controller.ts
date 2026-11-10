import { Response } from 'express';
import { ApiResponse, ApiError } from '../utils/apiResponse';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AuthController {
  // POST /api/v1/auth/register
  async register(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { name, phone, password } = req.body;
      const result = await authService.register(name, phone, password);
      return ApiResponse.success(res, result, 'Đăng ký tài khoản thành công', 201);
    } catch (err) {
      if (err instanceof ApiError) {
        return ApiResponse.error(res, err.message, err.statusCode);
      }
      return ApiResponse.error(res, 'Đã có lỗi xảy ra khi đăng ký', 500);
    }
  }

  // POST /api/v1/auth/login
  async login(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { phone, password } = req.body;
      const result = await authService.login(phone, password);
      return ApiResponse.success(res, result, 'Đăng nhập thành công');
    } catch (err) {
      if (err instanceof ApiError) {
        return ApiResponse.error(res, err.message, err.statusCode);
      }
      return ApiResponse.error(res, 'Đã có lỗi xảy ra khi đăng nhập', 500);
    }
  }

  // GET /api/v1/auth/me
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const user = await authService.getProfile(userId);
      return ApiResponse.success(res, user, 'Lấy thông tin tài khoản thành công');
    } catch (err) {
      if (err instanceof ApiError) {
        return ApiResponse.error(res, err.message, err.statusCode);
      }
      return ApiResponse.error(res, 'Đã có lỗi xảy ra', 500);
    }
  }

  // PUT /api/v1/auth/profile
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { name, phone } = req.body;
      const user = await authService.updateProfile(userId, { name, phone });
      return ApiResponse.success(res, user, 'Cập nhật thông tin tài khoản thành công');
    } catch (err) {
      if (err instanceof ApiError) {
        return ApiResponse.error(res, err.message, err.statusCode);
      }
      return ApiResponse.error(res, 'Đã có lỗi xảy ra khi cập nhật', 500);
    }
  }
}

export const authController = new AuthController();

