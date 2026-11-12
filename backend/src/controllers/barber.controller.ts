import { Request, Response } from 'express';
import { BarberModel } from '../models/barber.model';
import { ApiResponse } from '../utils/apiResponse';

export const getAllBarbers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const barbers = await BarberModel.find({ isActive: true }).sort({ rating: -1, createdAt: 1 }).lean();
    ApiResponse.success(res, barbers, 'Lấy danh sách thợ cắt tóc thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách thợ cắt tóc', 500, err);
  }
};

export const getBarberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const barber = await BarberModel.findById(id).lean();
    if (!barber) {
      ApiResponse.error(res, 'Không tìm thấy thợ cắt tóc', 404);
      return;
    }
    ApiResponse.success(res, barber, 'Lấy thông tin thợ cắt tóc thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy thông tin thợ cắt tóc', 500, err);
  }
};

