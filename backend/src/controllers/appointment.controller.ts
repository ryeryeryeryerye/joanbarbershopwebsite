import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AppointmentModel, AppointmentStatus } from '../models/appointment.model';
import { UserModel } from '../models/user.model';
import { ServiceModel } from '../models/service.model';
import { BarberModel } from '../models/barber.model';
import { ApiResponse } from '../utils/apiResponse';

// ─── POST /api/v1/appointments ───────────────────────────────────────────────
// Tạo lịch hẹn mới (customer)
export const createAppointment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      ApiResponse.error(res, 'Vui lòng đăng nhập để đặt lịch', 401);
      return;
    }

    const {
      barberId,
      barberName,
      serviceId,
      serviceName,
      servicePrice,
      date,
      timeSlot,
      note,
      customerName,
      customerPhone,
    } = req.body;

    if (!date || !timeSlot) {
      ApiResponse.error(res, 'Vui lòng chọn ngày và giờ hẹn', 400);
      return;
    }

    // 1. Tìm thông tin khách hàng
    const userDoc = await UserModel.findById(customerId).lean();
    const finalCustomerName = (customerName || userDoc?.name || 'Khách hàng').trim();
    const finalCustomerPhone = (customerPhone || userDoc?.phone || '').trim();

    if (!finalCustomerPhone) {
      ApiResponse.error(res, 'Vui lòng cung cấp số điện thoại liên hệ', 400);
      return;
    }

    // 2. Tìm thông tin dịch vụ
    let resolvedServiceId: Types.ObjectId | undefined;
    let finalServiceName = serviceName || '';
    let finalPrice = Number(servicePrice) || 0;

    if (serviceId && Types.ObjectId.isValid(serviceId)) {
      const srv = await ServiceModel.findById(serviceId).lean();
      if (srv) {
        resolvedServiceId = srv._id as Types.ObjectId;
        finalServiceName = srv.name;
        finalPrice = srv.price;
      }
    } else if (serviceName) {
      const srv = await ServiceModel.findOne({ name: new RegExp(`^${serviceName}$`, 'i') }).lean();
      if (srv) {
        resolvedServiceId = srv._id as Types.ObjectId;
        finalServiceName = srv.name;
        finalPrice = srv.price;
      }
    }

    if (!finalServiceName) {
      finalServiceName = 'Combo Cắt Tóc Barbershop';
      finalPrice = finalPrice || 150000;
    }

    // 3. Tìm thông tin thợ cắt tóc
    let resolvedBarberId: Types.ObjectId | undefined;
    let finalBarberName = barberName || 'Thợ Bất Kỳ';

    if (barberId && barberId !== 'any' && Types.ObjectId.isValid(barberId)) {
      const bbr = await BarberModel.findById(barberId).lean();
      if (bbr) {
        resolvedBarberId = bbr._id as Types.ObjectId;
        finalBarberName = bbr.name;
      }
    } else if (barberName && barberName !== 'Thợ Bất Kỳ') {
      const bbr = await BarberModel.findOne({ name: new RegExp(`^${barberName}$`, 'i') }).lean();
      if (bbr) {
        resolvedBarberId = bbr._id as Types.ObjectId;
        finalBarberName = bbr.name;
      }
    }

    // 4. Kiểm tra trùng slot (nếu đã chọn đích danh thợ)
    if (resolvedBarberId) {
      const existing = await AppointmentModel.findOne({
        barberId: resolvedBarberId,
        date,
        timeSlot,
        status: { $nin: ['cancelled'] },
      });
      if (existing) {
        ApiResponse.error(res, 'Khung giờ này của thợ đã có người đặt, vui lòng chọn giờ hoặc thợ khác', 409);
        return;
      }
    }

    // 5. Lưu vào MongoDB
    const appointment = await AppointmentModel.create({
      customerId: new Types.ObjectId(customerId),
      barberId: resolvedBarberId,
      serviceId: resolvedServiceId,
      date,
      timeSlot,
      price: finalPrice,
      note: note || '',
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      serviceName: finalServiceName,
      barberName: finalBarberName,
      status: 'pending',
    });

    ApiResponse.success(res, appointment, 'Đặt lịch thành công', 201);
  } catch (err) {
    ApiResponse.error(res, 'Lỗi hệ thống khi tạo lịch hẹn', 500, err);
  }
};

// ─── GET /api/v1/appointments/my ─────────────────────────────────────────────
// Lịch hẹn của khách hàng đang đăng nhập
export const getMyAppointments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      ApiResponse.error(res, 'Vui lòng đăng nhập', 401);
      return;
    }

    const appointments = await AppointmentModel
      .find({ customerId: new Types.ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .lean();

    ApiResponse.success(res, appointments, 'Lấy danh sách lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách lịch hẹn', 500, err);
  }
};

// ─── GET /api/v1/appointments/:id ────────────────────────────────────────────
// Chi tiết 1 lịch hẹn
export const getAppointmentById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID lịch hẹn không hợp lệ', 400);
      return;
    }

    const appointment = await AppointmentModel.findById(id).lean();
    if (!appointment) {
      ApiResponse.error(res, 'Không tìm thấy lịch hẹn', 404);
      return;
    }

    const isOwner  = String(appointment.customerId) === req.user?.id;
    const isAdmin  = req.user?.role === 'admin';
    const isBarber = appointment.barberId && String(appointment.barberId) === req.user?.id;

    if (!isOwner && !isAdmin && !isBarber) {
      ApiResponse.error(res, 'Không có quyền xem lịch hẹn này', 403);
      return;
    }

    ApiResponse.success(res, appointment, 'Lấy chi tiết lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy chi tiết lịch hẹn', 500, err);
  }
};

// ─── PUT /api/v1/appointments/:id ───────────────────────────────────────────
// Chỉnh sửa lịch hẹn (khách hàng hoặc admin, chỉ khi status = pending)
export const updateAppointment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID lịch hẹn không hợp lệ', 400);
      return;
    }

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      ApiResponse.error(res, 'Không tìm thấy lịch hẹn', 404);
      return;
    }

    const isOwner = String(appointment.customerId) === req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      ApiResponse.error(res, 'Không có quyền chỉnh sửa lịch hẹn này', 403);
      return;
    }

    if (!isAdmin && appointment.status !== 'pending') {
      ApiResponse.error(res, 'Chỉ có thể chỉnh sửa lịch hẹn đang ở trạng thái chờ xác nhận', 400);
      return;
    }

    const { date, timeSlot, note, barberId, barberName, serviceId, serviceName, servicePrice } = req.body;

    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (note !== undefined) appointment.note = note;

    // Cập nhật dịch vụ nếu có
    if (serviceId && Types.ObjectId.isValid(serviceId)) {
      const srv = await ServiceModel.findById(serviceId).lean();
      if (srv) {
        appointment.serviceId = srv._id as Types.ObjectId;
        appointment.serviceName = srv.name;
        appointment.price = srv.price;
      }
    } else if (serviceName) {
      const srv = await ServiceModel.findOne({ name: new RegExp(`^${serviceName}$`, 'i') }).lean();
      if (srv) {
        appointment.serviceId = srv._id as Types.ObjectId;
        appointment.serviceName = srv.name;
        appointment.price = srv.price;
      } else {
        appointment.serviceName = serviceName;
      }
      if (servicePrice) {
        appointment.price = Number(servicePrice);
      }
    }

    // Cập nhật thợ nếu có
    if (barberId && barberId !== 'any' && Types.ObjectId.isValid(barberId)) {
      const bbr = await BarberModel.findById(barberId).lean();
      if (bbr) {
        appointment.barberId = bbr._id as Types.ObjectId;
        appointment.barberName = bbr.name;
      }
    } else if (barberName) {
      if (barberName === 'Thợ Bất Kỳ') {
        appointment.barberId = undefined;
        appointment.barberName = 'Thợ Bất Kỳ';
      } else {
        const bbr = await BarberModel.findOne({ name: new RegExp(`^${barberName}$`, 'i') }).lean();
        if (bbr) {
          appointment.barberId = bbr._id as Types.ObjectId;
          appointment.barberName = bbr.name;
        } else {
          appointment.barberName = barberName;
        }
      }
    }

    // Kiểm tra slot trùng nếu có chọn thợ đích danh
    if (appointment.barberId) {
      const existing = await AppointmentModel.findOne({
        _id: { $ne: appointment._id },
        barberId: appointment.barberId,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: { $nin: ['cancelled'] },
      });
      if (existing) {
        ApiResponse.error(res, 'Khung giờ này của thợ đã có người đặt, vui lòng chọn giờ khác', 409);
        return;
      }
    }

    await appointment.save();

    ApiResponse.success(res, appointment, 'Cập nhật lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi cập nhật lịch hẹn', 500, err);
  }
};

// ─── PATCH /api/v1/appointments/:id/cancel ───────────────────────────────────
// Huỷ lịch hẹn (chỉ khi status = pending)
export const cancelAppointment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID lịch hẹn không hợp lệ', 400);
      return;
    }

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      ApiResponse.error(res, 'Không tìm thấy lịch hẹn', 404);
      return;
    }

    const isOwner = String(appointment.customerId) === req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      ApiResponse.error(res, 'Không có quyền huỷ lịch hẹn này', 403);
      return;
    }

    if (appointment.status === 'cancelled') {
      ApiResponse.error(res, 'Lịch hẹn đã được huỷ trước đó', 400);
      return;
    }

    if (!isAdmin && appointment.status !== 'pending') {
      ApiResponse.error(res, 'Chỉ có thể huỷ lịch hẹn đang ở trạng thái chờ xác nhận', 400);
      return;
    }

    appointment.status = 'cancelled';
    await appointment.save();

    ApiResponse.success(res, appointment, 'Huỷ lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi huỷ lịch hẹn', 500, err);
  }
};

// ─── DELETE /api/v1/appointments/:id ─────────────────────────────────────────
// Xoá lịch hẹn (chỉ cho phép khi lịch đã huỷ 'cancelled' hoặc admin)
export const deleteAppointment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID lịch hẹn không hợp lệ', 400);
      return;
    }

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      ApiResponse.error(res, 'Không tìm thấy lịch hẹn', 404);
      return;
    }

    const isOwner = String(appointment.customerId) === req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      ApiResponse.error(res, 'Không có quyền xoá lịch hẹn này', 403);
      return;
    }

    if (!isAdmin && appointment.status !== 'cancelled') {
      ApiResponse.error(res, 'Chỉ có thể xoá các lịch hẹn đã bị huỷ', 400);
      return;
    }

    await AppointmentModel.findByIdAndDelete(id);

    ApiResponse.success(res, { id }, 'Xoá lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi xoá lịch hẹn', 500, err);
  }
};

// ─── GET /api/v1/appointments (admin) ────────────────────────────────────────
export const getAllAppointments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, date, barberId } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (status)   filter.status   = status as AppointmentStatus;
    if (date)     filter.date     = date as string;
    if (barberId && Types.ObjectId.isValid(barberId as string)) {
      filter.barberId = new Types.ObjectId(barberId as string);
    }

    const appointments = await AppointmentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    ApiResponse.success(res, appointments, 'Lấy tất cả lịch hẹn thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi lấy danh sách lịch hẹn', 500, err);
  }
};

// ─── PATCH /api/v1/appointments/:id/status (admin/barber) ────────────────────
export const updateAppointmentStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      ApiResponse.error(res, 'ID lịch hẹn không hợp lệ', 400);
      return;
    }

    const { status } = req.body as { status: AppointmentStatus };
    const validStatuses: AppointmentStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      ApiResponse.error(res, `Trạng thái không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}`, 400);
      return;
    }

    const appointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      ApiResponse.error(res, 'Không tìm thấy lịch hẹn', 404);
      return;
    }

    ApiResponse.success(res, appointment, 'Cập nhật trạng thái thành công');
  } catch (err) {
    ApiResponse.error(res, 'Lỗi khi cập nhật trạng thái lịch hẹn', 500, err);
  }
};
