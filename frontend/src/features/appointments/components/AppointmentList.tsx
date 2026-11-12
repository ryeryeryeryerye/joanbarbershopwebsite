import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  Scissors,
  ArrowLeft,
  Loader2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Edit3,
  X,
  Check,
  User,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../hooks/useAppointments';
import { Appointment, AppointmentStatus } from '../types/appointmentTypes';
import { formatCurrency } from '@/utils';
import { ALL_SHOP_TIME_SLOTS } from '@/features/booking/constants/timeSlots';
import { CANONICAL_SERVICES } from '@/features/services';

// Badge màu theo trạng thái
const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  pending:     { label: 'Chờ xác nhận', className: 'bg-yellow-950/50 text-yellow-400 border-yellow-800/60' },
  confirmed:   { label: 'Đã xác nhận',  className: 'bg-blue-950/50  text-blue-400  border-blue-800/60'  },
  in_progress: { label: 'Đang thực hiện', className: 'bg-purple-950/50 text-purple-400 border-purple-800/60' },
  completed:   { label: 'Hoàn thành',   className: 'bg-green-950/50 text-green-400 border-green-800/60' },
  cancelled:   { label: 'Đã huỷ',       className: 'bg-zinc-800/60  text-zinc-500  border-zinc-700/60'  },
};

const BARBER_OPTIONS = [
  'Thợ Bất Kỳ',
  'Alex Trần',
  'Hoàng Barber',
  'David Nguyễn',
  'Minh Quân',
  'Kenny Vũ',
];

// Hàm sinh 7 ngày kế tiếp
const getNext7Days = () => {
  const days = [];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const isTomorrow = i === 1;
    let label = `${dayNames[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
    if (isToday) label = `Hôm nay (${d.getDate()}/${d.getMonth() + 1})`;
    if (isTomorrow) label = `Ngày mai (${d.getDate()}/${d.getMonth() + 1})`;

    days.push({ dateStr, label });
  }
  return days;
};

// ─── MODAL XÁC NHẬN HUỶ LỊCH HẸN ─────────────────────────────────────────────
interface CancelConfirmModalProps {
  appt: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  appt,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appt) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(appt._id);
      onClose();
    } catch {
      setError('Huỷ lịch không thành công. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-card border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-red-400">
          <div className="p-3 bg-red-950/50 border border-red-900/60 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Xác nhận huỷ lịch hẹn</h3>
            <p className="text-xs text-zinc-400">Thao tác này sẽ huỷ lịch hẹn của bạn</p>
          </div>
        </div>

        {/* Thông tin lịch hẹn sắp huỷ */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Dịch vụ:</span>
            <span className="font-bold text-white">{appt.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Thời gian:</span>
            <span className="text-orange-400 font-semibold">{appt.timeSlot} · {appt.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Thợ cắt tóc:</span>
            <span className="text-zinc-200">{appt.barberName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Giá:</span>
            <span className="text-white font-bold">{formatCurrency(appt.price)}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Bạn có chắc chắn muốn huỷ lịch hẹn này không? Trạng thái sẽ được cập nhật thành <span className="text-red-400 font-semibold">Đã huỷ</span> trên hệ thống.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
          >
            Giữ lại lịch hẹn
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-lg shadow-red-950/50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang huỷ...</span>
              </>
            ) : (
              <span>Xác nhận huỷ</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL XÁC NHẬN XOÁ LỊCH HẸN ĐÃ HUỶ ──────────────────────────────────────
interface DeleteConfirmModalProps {
  appt: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  appt,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appt) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(appt._id);
      onClose();
    } catch {
      setError('Xoá lịch không thành công. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-card border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-zinc-400">
          <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Xoá lịch hẹn đã huỷ</h3>
            <p className="text-xs text-zinc-400">Xoá vĩnh viễn khỏi danh sách của bạn</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Dịch vụ:</span>
            <span className="font-bold text-white">{appt.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Ngày giờ:</span>
            <span className="text-zinc-300">{appt.timeSlot} · {appt.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Trạng thái:</span>
            <span className="text-red-400 font-semibold">Đã huỷ</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Bạn có chắc chắn muốn xoá lịch hẹn này? Dữ liệu sẽ được xoá hoàn toàn khỏi cơ sở dữ liệu MongoDB.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-red-600 border border-zinc-700 hover:border-red-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xoá...</span>
              </>
            ) : (
              <span>Xoá vĩnh viễn</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL CHỈNH SỬA LỊCH HẸN (BAO GỒM CHỈNH GÓI DỊCH VỤ) ────────────────────
interface EditAppointmentModalProps {
  appt: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: {
      date: string;
      timeSlot: string;
      barberName: string;
      note: string;
      serviceId?: string;
      serviceName?: string;
      servicePrice?: number;
    }
  ) => Promise<void>;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appt,
  isOpen,
  onClose,
  onSave,
}) => {
  const daysList = getNext7Days();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [barberName, setBarberName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state khi mở modal với appointment được chọn
  React.useEffect(() => {
    if (appt) {
      const matched = CANONICAL_SERVICES.find((s) => s.name === appt.serviceName);
      setSelectedServiceId(matched ? matched.id : 'srv-1');
      setDate(appt.date);
      setTimeSlot(appt.timeSlot);
      setBarberName(appt.barberName || 'Thợ Bất Kỳ');
      setNote(appt.note || '');
      setError(null);
    }
  }, [appt]);

  if (!isOpen || !appt) return null;

  const currentService = CANONICAL_SERVICES.find((s) => s.id === selectedServiceId) || CANONICAL_SERVICES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      setError('Vui lòng chọn ngày và giờ hẹn');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(appt._id, {
        date,
        timeSlot,
        barberName,
        note,
        serviceId: currentService.id,
        serviceName: currentService.name,
        servicePrice: currentService.price,
      });
      onClose();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      setError(errObj?.message || 'Cập nhật lịch hẹn thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-card border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-950/50 border border-orange-900/60 rounded-xl">
            <Edit3 className="w-5 h-5 text-cta-orange" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chỉnh sửa lịch hẹn</h3>
            <p className="text-xs text-zinc-400">Cập nhật gói dịch vụ, ngày giờ hoặc thợ cắt tóc</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. CHỌN GÓI DỊCH VỤ MỚI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-300 uppercase tracking-wider block">
                1. Gói dịch vụ
              </label>
              <span className="text-orange-400 font-bold text-xs">
                {formatCurrency(currentService.price)}
              </span>
            </div>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-cta-orange"
            >
              {CANONICAL_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMinutes} phút) - {formatCurrency(s.price)}
                </option>
              ))}
            </select>
          </div>

          {/* 2. CHỌN NGÀY HẸN */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">
              2. Chọn ngày hẹn
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {daysList.map((d) => {
                const isSelected = date === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setDate(d.dateStr)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-cta-orange border-cta-orange text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. CHỌN KHUNG GIỜ */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">
              3. Chọn khung giờ (08:30 - 21:00)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1 bg-zinc-950/60 rounded-xl border border-zinc-900">
              {ALL_SHOP_TIME_SLOTS.map((t) => {
                const isSelected = timeSlot === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeSlot(t)}
                    className={`py-1.5 px-2 rounded-md border text-[11px] font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-cta-orange border-cta-orange text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-cta-orange hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. CHỌN THỢ CẮT TÓC */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">
              4. Thợ cắt tóc
            </label>
            <select
              value={barberName}
              onChange={(e) => setBarberName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cta-orange"
            >
              {BARBER_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 5. GHI CHÚ */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">
              5. Ghi chú thêm (tuỳ chọn)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Cắt ngắn gọn gàng, tạo kiểu nhẹ..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cta-orange"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-cta-orange hover:bg-orange-500 rounded-lg transition-all shadow-lg shadow-orange-950/50 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── THẺ LỊCH HẸN (APPOINTMENT CARD) ─────────────────────────────────────────
function AppointmentCard({
  appt,
  onEdit,
  onRequestCancel,
  onRequestDelete,
}: {
  appt: Appointment;
  onEdit: (appt: Appointment) => void;
  onRequestCancel: (appt: Appointment) => void;
  onRequestDelete: (appt: Appointment) => void;
}) {
  const cfg = statusConfig[appt.status];
  const canModify = appt.status === 'pending';
  const isCancelled = appt.status === 'cancelled';

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base leading-tight truncate">
            {appt.serviceName || 'Dịch vụ'}
          </p>
          <p className="text-zinc-400 text-xs mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span>Thợ: <strong className="text-zinc-200">{appt.barberName || 'Thợ Bất Kỳ'}</strong></span>
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.className}`}>
          {cfg.label}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
        <div className="flex items-center gap-2 text-zinc-300">
          <Clock className="w-4 h-4 text-cta-orange flex-shrink-0" />
          <span>
            <strong className="text-white font-semibold">{appt.timeSlot}</strong> ngày {appt.date}
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Scissors className="w-4 h-4 text-cta-orange flex-shrink-0" />
          <span className="font-bold text-white text-sm">{formatCurrency(appt.price)}</span>
        </div>
      </div>

      {appt.note && (
        <p className="text-xs text-zinc-400 italic bg-zinc-950/40 p-2.5 rounded border border-zinc-900">
          <strong className="text-zinc-500 not-italic">Ghi chú:</strong> {appt.note}
        </p>
      )}

      {/* Actions */}
      <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-end gap-2.5">
        {canModify && (
          <>
            <button
              type="button"
              onClick={() => onEdit(appt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cta-orange transition-all duration-150"
            >
              <Edit3 className="w-3.5 h-3.5 text-cta-orange" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              type="button"
              onClick={() => onRequestCancel(appt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 border border-red-900/50 hover:border-red-600 transition-all duration-150"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Huỷ lịch</span>
            </button>
          </>
        )}

        {isCancelled && (
          <button
            type="button"
            onClick={() => onRequestDelete(appt)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-800 transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Xoá khỏi danh sách</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── TRANG DANH SÁCH LỊCH ĐẶT ────────────────────────────────────────────────
export const AppointmentList: React.FC = () => {
  const {
    appointments,
    isLoading,
    error,
    refetch,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  } = useAppointments();

  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [deletingAppt, setDeletingAppt] = useState<Appointment | null>(null);

  const handleSaveEdit = async (
    id: string,
    data: {
      date: string;
      timeSlot: string;
      barberName: string;
      note: string;
      serviceId?: string;
      serviceName?: string;
      servicePrice?: number;
    }
  ) => {
    await updateAppointment(id, data);
  };

  const handleConfirmCancel = async (id: string) => {
    await cancelAppointment(id);
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteAppointment(id);
  };

  return (
    <div className="min-h-screen bg-dark-bg py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:border-cta-orange hover:bg-cta-orange transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              title="Về trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Lịch Đặt Của Bạn</h1>
              <p className="text-zinc-400 text-sm mt-0.5">
                {isLoading ? 'Đang tải...' : `${appointments.length} lịch hẹn`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-all duration-200 disabled:opacity-40"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-cta-orange animate-spin" />
            <p className="text-zinc-400 text-sm">Đang tải danh sách lịch hẹn...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={refetch}
              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && appointments.length === 0 && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-14 flex flex-col items-center justify-center text-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <CalendarCheck className="w-9 h-9 text-zinc-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cta-orange/10 border border-cta-orange/40 flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-cta-orange" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Chưa có lịch hẹn nào</h2>
              <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                Bạn chưa đặt lịch nào. Hãy đặt lịch cắt tóc ngay để không phải chờ đợi!
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cta-orange hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                <Clock className="w-4 h-4" />
                Đặt lịch ngay
              </Link>
              <Link
                to="/#services"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-semibold border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Xem dịch vụ
              </Link>
            </div>
          </div>
        )}

        {/* Appointment list */}
        {!isLoading && !error && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appt={appt}
                onEdit={(item) => setEditingAppt(item)}
                onRequestCancel={(item) => setCancellingAppt(item)}
                onRequestDelete={(item) => setDeletingAppt(item)}
              />
            ))}
            <div className="pt-4 text-center">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cta-orange hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                <Clock className="w-4 h-4" />
                Đặt thêm lịch mới
              </Link>
            </div>
          </div>
        )}

        {/* Modals */}
        <EditAppointmentModal
          appt={editingAppt}
          isOpen={Boolean(editingAppt)}
          onClose={() => setEditingAppt(null)}
          onSave={handleSaveEdit}
        />

        <CancelConfirmModal
          appt={cancellingAppt}
          isOpen={Boolean(cancellingAppt)}
          onClose={() => setCancellingAppt(null)}
          onConfirm={handleConfirmCancel}
        />

        <DeleteConfirmModal
          appt={deletingAppt}
          isOpen={Boolean(deletingAppt)}
          onClose={() => setDeletingAppt(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};
