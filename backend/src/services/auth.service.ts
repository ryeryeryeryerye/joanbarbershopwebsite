import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/user.model';
import { ApiError } from '../utils/apiResponse';
import { ENV } from '../config/env';

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
}

class AuthService {
  // Tạo JWT token
  private generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  // Đăng ký tài khoản mới (Customer)
  async register(
    name: string,
    phone: string,
    password: string
  ): Promise<AuthPayload> {
    // Kiểm tra SĐT đã tồn tại chưa
    const existing = await UserModel.findOne({ phone: phone.trim() });
    if (existing) {
      throw new ApiError(409, 'Số điện thoại này đã được đăng ký');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với role customer
    const user = await UserModel.create({
      name: name.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'customer',
    });

    const token = this.generateToken(String(user._id), user.role);

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  // Đăng nhập
  async login(phone: string, password: string): Promise<AuthPayload> {
    // Tìm user theo SĐT
    const user = await UserModel.findOne({ phone: phone.trim() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Số điện thoại hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Số điện thoại hoặc mật khẩu không đúng');
    }

    const token = this.generateToken(String(user._id), user.role);

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  // Lấy thông tin profile
  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }
    return user;
  }

  // Cập nhật profile
  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string }
  ): Promise<Partial<IUser>> {
    // Nếu đổi SĐT, kiểm tra trùng
    if (data.phone) {
      const existing = await UserModel.findOne({
        phone: data.phone.trim(),
        _id: { $ne: userId },
      });
      if (existing) {
        throw new ApiError(409, 'Số điện thoại này đã được sử dụng bởi tài khoản khác');
      }
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(data.name && { name: data.name.trim() }),
        ...(data.phone && { phone: data.phone.trim() }),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(404, 'Không tìm thấy người dùng');
    }
    return user;
  }
}

export const authService = new AuthService();

