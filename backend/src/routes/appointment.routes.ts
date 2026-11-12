import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller';

const router = Router();

// ── Customer ────────────────────────────────────────────────
// POST   /api/v1/appointments          → Tạo lịch hẹn mới
router.post('/', authenticate, createAppointment);

// GET    /api/v1/appointments/my       → Lịch hẹn của tôi
router.get('/my', authenticate, getMyAppointments);

// GET    /api/v1/appointments/:id      → Chi tiết 1 lịch hẹn
router.get('/:id', authenticate, getAppointmentById);

// PUT    /api/v1/appointments/:id      → Chỉnh sửa lịch hẹn
router.put('/:id', authenticate, updateAppointment);

// PATCH  /api/v1/appointments/:id/cancel → Huỷ lịch hẹn
router.patch('/:id/cancel', authenticate, cancelAppointment);

// DELETE /api/v1/appointments/:id      → Xoá lịch hẹn đã huỷ
router.delete('/:id', authenticate, deleteAppointment);

// ── Admin / Barber ──────────────────────────────────────────
// GET    /api/v1/appointments          → Tất cả lịch hẹn (admin)
router.get('/', authenticate, authorize(['admin', 'barber']), getAllAppointments);

// PATCH  /api/v1/appointments/:id/status → Cập nhật trạng thái (admin/barber)
router.patch('/:id/status', authenticate, authorize(['admin', 'barber']), updateAppointmentStatus);

export const appointmentRoutes = router;

