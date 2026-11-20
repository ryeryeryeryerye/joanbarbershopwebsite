import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ServiceModel } from '../models/service.model';
import { ApiResponse } from '../utils/apiResponse';

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const services = await ServiceModel.find(filter).sort({ createdAt: 1 }).lean();
    ApiResponse.success(res, services, 'Lấy danh sách dịch vụ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách dịch vụ', 500, err);
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID dịch vụ không hợp lệ', 400);
      return;
    }
    const service = await ServiceModel.findById(id).lean();
    if (!service) {
      ApiResponse.error(res, 'Không tìm thấy dịch vụ', 404);
      return;
    }
    ApiResponse.success(res, service, 'Lấy thông tin dịch vụ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy thông tin dịch vụ', 500, err);
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, durationMinutes, price, imageUrl, isActive } = req.body;
    if (!name || !name.trim()) {
      ApiResponse.error(res, 'Tên dịch vụ không được để trống', 400);
      return;
    }
    if (price === undefined || price < 0) {
      ApiResponse.error(res, 'Giá dịch vụ không hợp lệ', 400);
      return;
    }

    const newService = await ServiceModel.create({
      name: name.trim(),
      description: description?.trim() || '',
      durationMinutes: durationMinutes ? Number(durationMinutes) : 30,
      price: Number(price),
      imageUrl: imageUrl?.trim() || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    ApiResponse.success(res, newService, 'Thêm dịch vụ thành công', 201);
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi tạo dịch vụ', 500, err);
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID dịch vụ không hợp lệ', 400);
      return;
    }

    const { name, description, durationMinutes, price, imageUrl, isActive } = req.body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (durationMinutes !== undefined) updateData.durationMinutes = Number(durationMinutes);
    if (price !== undefined) updateData.price = Number(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedService = await ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      ApiResponse.error(res, 'Không tìm thấy dịch vụ cần cập nhật', 404);
      return;
    }

    ApiResponse.success(res, updatedService, 'Cập nhật dịch vụ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi cập nhật dịch vụ', 500, err);
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID dịch vụ không hợp lệ', 400);
      return;
    }

    const deleted = await ServiceModel.findByIdAndDelete(id);
    if (!deleted) {
      ApiResponse.error(res, 'Không tìm thấy dịch vụ cần xóa', 404);
      return;
    }

    ApiResponse.success(res, { id }, 'Xóa dịch vụ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi xóa dịch vụ', 500, err);
  }
};
