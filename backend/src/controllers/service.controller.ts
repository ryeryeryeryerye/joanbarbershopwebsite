import { Request, Response } from 'express';
import { ServiceModel } from '../models/service.model';
import { ApiResponse } from '../utils/apiResponse';

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await ServiceModel.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    ApiResponse.success(res, services, 'Lấy danh sách dịch vụ thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách dịch vụ', 500, err);
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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

