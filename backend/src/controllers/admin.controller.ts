import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AppointmentModel } from '../models/appointment.model';
import { UserModel } from '../models/user.model';
import { BarberModel } from '../models/barber.model';
import { ServiceModel } from '../models/service.model';
import { ApiResponse } from '../utils/apiResponse';

export const getDashboardSummary = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const vnTime = new Date(utc + 7 * 3600000);
    const today = `${vnTime.getFullYear()}-${String(vnTime.getMonth() + 1).padStart(2, '0')}-${String(vnTime.getDate()).padStart(2, '0')}`;

    const [
      totalAppointments,
      totalCustomers,
      totalBarbers,
      totalServices,
      pendingCount,
      confirmedCount,
      inProgressCount,
      completedCount,
      cancelledCount,
      todayCount,
      revenueResult,
    ] = await Promise.all([
      AppointmentModel.countDocuments(),
      UserModel.countDocuments({ role: 'customer' }),
      BarberModel.countDocuments({ isActive: true }),
      ServiceModel.countDocuments({ isActive: true }),
      AppointmentModel.countDocuments({ status: 'pending' }),
      AppointmentModel.countDocuments({ status: 'confirmed' }),
      AppointmentModel.countDocuments({ status: 'in_progress' }),
      AppointmentModel.countDocuments({ status: 'completed' }),
      AppointmentModel.countDocuments({ status: 'cancelled' }),
      AppointmentModel.countDocuments({ date: today }),
      AppointmentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const summary = {
      totalAppointments,
      totalCustomers,
      totalBarbers,
      totalServices,
      totalRevenue,
      pendingAppointments: pendingCount,
      confirmedAppointments: confirmedCount,
      inProgressAppointments: inProgressCount,
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
      todayAppointments: todayCount,
    };

    ApiResponse.success(res, summary, 'Lấy dữ liệu thống kê quản trị thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy dữ liệu thống kê', 500, err);
  }
};
