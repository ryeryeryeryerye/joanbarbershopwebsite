import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { BarberModel } from '../models/barber.model';
import { ApiResponse } from '../utils/apiResponse';

export const getAllBarbers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const barbers = await BarberModel.find(filter).sort({ rating: -1, createdAt: 1 }).lean();
    ApiResponse.success(res, barbers, 'Lấy danh sách thợ cắt tóc thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách thợ cắt tóc', 500, err);
  }
};

export const getBarberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID thợ cắt tóc không hợp lệ', 400);
      return;
    }
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

export const createBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, title, experienceYears, rating, reviewCount, specialty, imageUrl, isActive } = req.body;
    if (!name || !name.trim()) {
      ApiResponse.error(res, 'Tên thợ cắt tóc không được để trống', 400);
      return;
    }
    if (!title || !title.trim()) {
      ApiResponse.error(res, 'Chức danh thợ không được để trống', 400);
      return;
    }

    const newBarber = await BarberModel.create({
      name: name.trim(),
      title: title.trim(),
      experienceYears: experienceYears !== undefined ? Number(experienceYears) : 3,
      rating: rating !== undefined ? Number(rating) : 5.0,
      reviewCount: reviewCount !== undefined ? Number(reviewCount) : 0,
      specialty: specialty?.trim() || '',
      imageUrl: imageUrl?.trim() || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    ApiResponse.success(res, newBarber, 'Thêm thợ cắt tóc thành công', 201);
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi tạo thợ cắt tóc', 500, err);
  }
};

export const updateBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID thợ cắt tóc không hợp lệ', 400);
      return;
    }

    const { name, title, experienceYears, rating, reviewCount, specialty, imageUrl, isActive } = req.body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (experienceYears !== undefined) updateData.experienceYears = Number(experienceYears);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (reviewCount !== undefined) updateData.reviewCount = Number(reviewCount);
    if (specialty !== undefined) updateData.specialty = specialty.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedBarber = await BarberModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBarber) {
      ApiResponse.error(res, 'Không tìm thấy thợ cắt tóc cần cập nhật', 404);
      return;
    }

    ApiResponse.success(res, updatedBarber, 'Cập nhật thông tin thợ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi cập nhật thợ cắt tóc', 500, err);
  }
};

export const deleteBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID thợ cắt tóc không hợp lệ', 400);
      return;
    }

    const deleted = await BarberModel.findByIdAndDelete(id);
    if (!deleted) {
      ApiResponse.error(res, 'Không tìm thấy thợ cần xóa', 404);
      return;
    }

    ApiResponse.success(res, { id }, 'Xóa thợ cắt tóc thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi xóa thợ cắt tóc', 500, err);
  }
};
