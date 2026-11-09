import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { authService } from '../services/auth.service';

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return ApiResponse.success(res, result, 'Đăng nhập thành công (Scaffold)');
  }

  async me(_req: Request, res: Response): Promise<Response> {
    return ApiResponse.success(
      res,
      { id: '1', name: 'Scaffold User', role: 'customer' },
      'Lấy thông tin người dùng hiện tại (Scaffold)'
    );
  }
}

export const authController = new AuthController();

