import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  User,
  Phone,
  Scissors,
  Clock,
  CheckCircle2,
  X,
  ListOrdered,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { AdminBarberItem, AdminAppointmentItem, AppointmentStatus } from '../types/adminTypes';

const SHOP_TIME_SLOTS = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

const formatLocalDate = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface AdminScheduleTabProps {
  onUpdateStats?: () => void;
}

export const AdminScheduleTab: React.FC<AdminScheduleTabProps> = ({ onUpdateStats }) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatLocalDate(new Date()));
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [barbers, setBarbers] = useState<AdminBarberItem[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentItem | null>(null);
  const [showBarberBreakdownModal, setShowBarberBreakdownModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lấy danh sách thợ
  useEffect(() => {
    adminApi.getAllBarbers(true).then((res) => {
      const data = res?.data || (res as unknown as AdminBarberItem[]);
      if (Array.isArray(data)) {
        setBarbers(data);
      }
    });
  }, []);

  // Lấy lịch hẹn theo ngày
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllAppointments({ date: selectedDate });
      const data = res?.data || (res as unknown as AdminAppointmentItem[]);
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Cập nhật trạng thái đơn hẹn từ timeline
  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    setStatusUpdating(true);
    setErrorMessage(null);
    try {
      const res = await adminApi.updateAppointmentStatus(appointmentId, newStatus);
      const updated = res?.data || (res as unknown as AdminAppointmentItem);
      setMessage(`Đã cập nhật trạng thái đơn sang: ${getStatusLabel(newStatus)}`);
      fetchAppointments();
      onUpdateStats?.();
      if (selectedAppointment && selectedAppointment._id === appointmentId) {
        setSelectedAppointment(updated || { ...selectedAppointment, status: newStatus });
      }
      setTimeout(() => setMessage(null), 3500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errText = err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái';
      setErrorMessage(errText);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Có lịch';
      case 'in_progress': return 'Đang cắt';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-950/60 text-amber-300 border-amber-700/80 hover:border-amber-500';
      case 'confirmed':
        return 'bg-blue-950/60 text-blue-300 border-blue-700/80 hover:border-blue-500';
      case 'in_progress':
        return 'bg-purple-950/60 text-purple-300 border-purple-700/80 hover:border-purple-500';
      case 'completed':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 hover:border-emerald-500';
      case 'cancelled':
        return 'bg-red-950/60 text-red-300 border-red-700/80 hover:border-red-500';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  // Lọc thợ theo filter
  const displayedBarbers = useMemo(() => {
    if (selectedBarberFilter === 'all') return barbers;
    return barbers.filter((b) => b._id === selectedBarberFilter);
  }, [barbers, selectedBarberFilter]);

  // Thống kê nhanh theo ngày đang chọn
  const activeAppointmentsOnDate = appointments.filter((a) => a.status !== 'cancelled');
  const bookedSlotsCount = activeAppointmentsOnDate.filter((a) => a.status === 'confirmed' || a.status === 'in_progress').length;

  // Thống kê chi tiết từng thợ có bao nhiêu đơn
  const barberBreakdown = useMemo(() => {
    return barbers.map((b) => {
      const apts = appointments.filter((a) => {
        if (a.status === 'cancelled') return false;
        const matchId = a.barberId && String(a.barberId).trim() === String(b._id).trim();
        const matchName = a.barberName && b.name && a.barberName.trim().toLowerCase() === b.name.trim().toLowerCase();
        return matchId || matchName;
      });
      return {
        barber: b,
        appointments: apts,
        total: apts.length,
        pending: apts.filter((a) => a.status === 'pending').length,
        confirmed: apts.filter((a) => a.status === 'confirmed').length,
        inProgress: apts.filter((a) => a.status === 'in_progress').length,
        completed: apts.filter((a) => a.status === 'completed').length,
      };
    });
  }, [barbers, appointments]);

  // Các đơn thợ bất kỳ chưa gán thợ
  const randomBarberAppointments = useMemo(() => {
    return appointments.filter(
      (a) =>
        (!a.barberId || a.barberName === 'Thợ Bất Kỳ' || String(a.barberId) === 'any') &&
        a.status !== 'cancelled' &&
        !barbers.some(
          (b) =>
            (a.barberId && String(b._id).trim() === String(a.barberId).trim()) ||
            (b.name && a.barberName && b.name.trim().toLowerCase() === a.barberName.trim().toLowerCase())
        )
    );
  }, [appointments, barbers]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            Quản Lý Lịch Trình Làm Việc Của Thợ
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Xem mã đơn trực tiếp trên từng khung giờ, điều phối thợ tự động và theo dõi đơn thực tế
          </p>
        </div>

        {/* Bộ lọc Ngày & Chọn Thợ */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs">
            <Calendar className="w-4 h-4 text-orange-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs">
            <User className="w-4 h-4 text-orange-400" />
            <select
              value={selectedBarberFilter}
              onChange={(e) => setSelectedBarberFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">Tất cả thợ ({barbers.length})</option>
              {barbers.map((b) => (
                <option key={b._id} value={b._id} className="bg-zinc-900 text-white">
                  {b.name} ({b.title})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(formatLocalDate(new Date()))}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded uppercase transition-colors cursor-pointer"
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* Thông báo cập nhật / Lỗi */}
      {message && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-950/50 border border-red-800/80 rounded text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Daily Summary Cards (BẤM VÀO ĐỂ XEM CHI TIẾT ĐƠN TỪNG THỢ) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setShowBarberBreakdownModal(true)}
          className="p-3.5 rounded bg-dark-card border border-dark-border hover:border-cta-orange cursor-pointer transition-all duration-200 group flex flex-col justify-between"
          title="Bấm để xem chi tiết từng thợ có bao nhiêu đơn"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase group-hover:text-orange-400 transition-colors">
              Đơn trong ngày
            </p>
            <span className="text-[10px] text-orange-400 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Xem chi tiết <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-2xl font-black text-white mt-1.5">{appointments.length} đơn</p>
          <p className="text-[10px] text-zinc-500 mt-1">Bấm để xem thợ A, thợ B bao nhiêu đơn</p>
        </div>

        <div className="p-3.5 rounded bg-dark-card border border-dark-border flex flex-col justify-between">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Có lịch (Đang chiếm slot)</p>
          <p className="text-2xl font-black text-blue-400 mt-1.5">{bookedSlotsCount} slot</p>
          <p className="text-[10px] text-zinc-500 mt-1">Đã xác nhận & đang phục vụ</p>
        </div>

        <div className="p-3.5 rounded bg-dark-card border border-dark-border flex flex-col justify-between">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Chờ duyệt (Chờ xác nhận)</p>
          <p className="text-2xl font-black text-amber-400 mt-1.5">
            {appointments.filter((a) => a.status === 'pending').length} đơn
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">Cần ấn xác nhận để có lịch</p>
        </div>

        <div className="p-3.5 rounded bg-dark-card border border-dark-border flex flex-col justify-between">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Đã hoàn tất</p>
          <p className="text-2xl font-black text-emerald-400 mt-1.5">
            {appointments.filter((a) => a.status === 'completed').length} đơn
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">Đã ghi nhận tiền & trả lịch trống</p>
        </div>
      </div>

      {/* Lịch Trình Từng Thợ (Timeline Matrix) */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 bg-dark-card border border-zinc-800 rounded">
            Đang tải lịch trình làm việc ngày {selectedDate}...
          </div>
        ) : displayedBarbers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 bg-dark-card border border-zinc-800 rounded">
            Chưa có thợ cắt tóc nào
          </div>
        ) : (
          displayedBarbers.map((barber) => {
            // Lọc danh sách đơn thuộc thợ này trong ngày (loại trừ đã hủy)
            const barberApts = appointments.filter((a) => {
              if (a.status === 'cancelled') return false;
              const matchId = a.barberId && String(a.barberId).trim() === String(barber._id).trim();
              const matchName =
                a.barberName && barber.name &&
                a.barberName.trim().toLowerCase() === barber.name.trim().toLowerCase();
              return matchId || matchName;
            });

            return (
              <div
                key={barber._id}
                className="p-5 rounded bg-dark-card border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
              >
                {/* Thông tin thợ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
                  <div className="flex items-center gap-3">
                    {barber.imageUrl ? (
                      <img
                        src={barber.imageUrl}
                        alt={barber.name}
                        className="w-12 h-12 rounded object-cover border border-zinc-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{barber.name}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {barber.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {barber.specialty ? `Sở trường: ${barber.specialty}` : 'Đa dạng kiểu tóc'} • {barber.experienceYears} năm KN
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 flex items-center gap-3">
                    <span className="font-semibold text-white">
                      {barberApts.length} đơn ngày {selectedDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBarberBreakdownModal(true)}
                      className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                    >
                      (Chi tiết)
                    </button>
                  </div>
                </div>

                {/* Grid Khung Giờ của Thợ */}
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                    {SHOP_TIME_SLOTS.map((slot) => {
                      // Tìm đơn đặt khớp với thợ và giờ
                      const apt = barberApts.find((a) => a.timeSlot === slot);
                      const isBooked = !!apt;

                      if (isBooked && apt) {
                        return (
                          <div
                            key={slot}
                            onClick={() => setSelectedAppointment(apt)}
                            className={`p-2.5 rounded border cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-md ${getStatusColor(
                              apt.status
                            )} flex flex-col justify-between min-h-[72px]`}
                            title="Bấm để xem chi tiết và thao tác đơn"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs flex items-center gap-1 text-white">
                                <Clock className="w-3 h-3 text-orange-400 opacity-90" />
                                {slot}
                              </span>
                              {/* HIỂN THỊ MÃ ĐƠN TRỰC TIẾP TRÊN THẺ */}
                              <span className="text-[9px] font-mono font-black uppercase px-1 py-0.2 rounded bg-black/70 text-orange-400 border border-orange-500/30 tracking-tight">
                                #{apt.bookingCode || apt._id.slice(-6).toUpperCase()}
                              </span>
                            </div>

                            <div className="mt-1 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <p className="font-bold text-[11px] truncate text-white">
                                  {apt.customerName}
                                </p>
                                <span className="text-[8px] font-black uppercase px-1 rounded bg-black/40 flex-shrink-0">
                                  {getStatusLabel(apt.status)}
                                </span>
                              </div>
                              <p className="text-[10px] opacity-80 truncate text-zinc-300">
                                {apt.serviceName}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      // Khung giờ TRỐNG (Thợ rảnh)
                      return (
                        <div
                          key={slot}
                          className="p-2.5 rounded border border-zinc-800/80 bg-zinc-900/30 text-zinc-500 flex flex-col justify-between min-h-[72px]"
                        >
                          <span className="font-semibold text-xs text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-600" />
                            {slot}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-medium italic mt-1">
                            Trống lịch
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: CHI TIẾT ĐƠN TRONG NGÀY THEO TỪNG THỢ (THỢ A, THỢ B BAO NHIÊU ĐƠN) */}
      {showBarberBreakdownModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowBarberBreakdownModal(false)}
        >
          <div
            className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Chi Tiết Đơn Trong Ngày Theo Từng Thợ ({selectedDate})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBarberBreakdownModal(false)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Danh sách từng thợ và số đơn */}
            <div className="space-y-4">
              {barberBreakdown.map(({ barber, appointments: bApts, total, pending, confirmed, inProgress, completed }) => (
                <div
                  key={barber._id}
                  className="p-4 rounded bg-dark-card border border-zinc-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2.5">
                      {barber.imageUrl ? (
                        <img
                          src={barber.imageUrl}
                          alt={barber.name}
                          className="w-8 h-8 rounded object-cover border border-zinc-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-orange-400 text-xs font-bold">
                          {barber.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">{barber.name}</h4>
                        <span className="text-[10px] text-zinc-400">{barber.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-black px-2.5 py-1 rounded bg-orange-950/60 text-orange-400 border border-orange-800/60">
                        Tổng: {total} đơn
                      </span>
                      {pending > 0 && (
                        <span className="text-[11px] text-amber-400">({pending} chờ)</span>
                      )}
                      {confirmed > 0 && (
                        <span className="text-[11px] text-blue-400">({confirmed} xác nhận)</span>
                      )}
                      {inProgress > 0 && (
                        <span className="text-[11px] text-purple-400">({inProgress} đang cắt)</span>
                      )}
                      {completed > 0 && (
                        <span className="text-[11px] text-emerald-400">({completed} xong)</span>
                      )}
                    </div>
                  </div>

                  {bApts.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-1">
                      Thợ này chưa có đơn nào trong ngày {selectedDate}.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          <tr>
                            <th className="py-1 px-2">Giờ</th>
                            <th className="py-1 px-2">Mã đơn</th>
                            <th className="py-1 px-2">Khách hàng</th>
                            <th className="py-1 px-2">Dịch vụ</th>
                            <th className="py-1 px-2">Giá</th>
                            <th className="py-1 px-2 text-right">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40">
                          {bApts.map((apt) => (
                            <tr key={apt._id} className="hover:bg-zinc-900/60 transition-colors">
                              <td className="py-2 px-2 font-bold text-white flex items-center gap-1">
                                <Clock className="w-3 h-3 text-orange-400" />
                                {apt.timeSlot}
                              </td>
                              <td className="py-2 px-2 font-mono font-bold text-orange-400">
                                #{apt.bookingCode || apt._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="py-2 px-2">
                                <p className="font-semibold text-white">{apt.customerName}</p>
                                <span className="text-[10px] text-zinc-400">{apt.customerPhone}</span>
                              </td>
                              <td className="py-2 px-2 text-zinc-300">{apt.serviceName}</td>
                              <td className="py-2 px-2 font-bold text-zinc-200">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(apt.price)}
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(apt.status)}`}>
                                  {getStatusLabel(apt.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Các đơn Thợ Bất Kỳ chưa được gán */}
              {randomBarberAppointments.length > 0 && (
                <div className="p-4 rounded bg-amber-950/20 border border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-800/40 pb-2">
                    <h4 className="text-sm font-bold text-amber-400 uppercase">
                      Đơn Đặt Thợ Ngẫu Nhiên ({randomBarberAppointments.length} đơn)
                    </h4>
                    <span className="text-xs text-amber-300">
                      Sẽ được tự động gán cho thợ còn trống khi bấm Xác nhận lịch
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-zinc-500 uppercase">
                        <tr>
                          <th className="py-1 px-2">Giờ</th>
                          <th className="py-1 px-2">Mã đơn</th>
                          <th className="py-1 px-2">Khách hàng</th>
                          <th className="py-1 px-2">Dịch vụ</th>
                          <th className="py-1 px-2 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40">
                        {randomBarberAppointments.map((apt) => (
                          <tr key={apt._id}>
                            <td className="py-2 px-2 font-bold text-white">{apt.timeSlot}</td>
                            <td className="py-2 px-2 font-mono font-bold text-orange-400">
                              #{apt.bookingCode || apt._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="py-2 px-2 text-white">{apt.customerName}</td>
                            <td className="py-2 px-2 text-zinc-300">{apt.serviceName}</td>
                            <td className="py-2 px-2 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowBarberBreakdownModal(false);
                                  setSelectedAppointment(apt);
                                }}
                                className="px-2 py-1 rounded bg-cta-orange text-white text-[10px] font-bold uppercase"
                              >
                                Xem & Duyệt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBarberBreakdownModal(false)}
                className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded text-xs hover:bg-zinc-800 uppercase"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM & THAO TÁC CHI TIẾT ĐƠN ĐẶT TỪ KHUNG GIỜ */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                  MÃ ĐƠN: #{selectedAppointment.bookingCode || selectedAppointment._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chi tiết đơn */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Trạng thái hiện tại:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusColor(selectedAppointment.status)}`}>
                  {getStatusLabel(selectedAppointment.status)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-zinc-500" /> Khách hàng:
                </span>
                <span className="font-bold text-white text-sm">{selectedAppointment.customerName}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-zinc-500" /> Điện thoại:
                </span>
                <a
                  href={`tel:${selectedAppointment.customerPhone}`}
                  className="font-bold text-orange-400 hover:underline"
                >
                  {selectedAppointment.customerPhone}
                </a>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-zinc-500" /> Dịch vụ:
                </span>
                <span className="font-semibold text-zinc-200">{selectedAppointment.serviceName}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-zinc-500" /> Thợ phụ trách:
                </span>
                <span className="font-bold text-orange-400">{selectedAppointment.barberName}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-500" /> Thời gian:
                </span>
                <span className="font-bold text-white">
                  {selectedAppointment.timeSlot} • Ngày {selectedAppointment.date}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Tổng tiền:</span>
                <span className="font-black text-orange-400 text-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedAppointment.price)}
                </span>
              </div>

              {selectedAppointment.note && (
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">Ghi chú của khách:</span>
                  <p>{selectedAppointment.note}</p>
                </div>
              )}
            </div>

            {/* Thông báo lỗi khi xác nhận nếu có */}
            {errorMessage && (
              <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Chuyển trạng thái thông minh */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Cập nhật trạng thái đơn hẹn:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAppointment._id, 'confirmed')}
                  className={`py-2 px-2.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedAppointment.status === 'confirmed'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-zinc-900 text-blue-400 border border-blue-900/60 hover:bg-blue-950/50'
                  }`}
                  title="Xác nhận lịch và ghi nhận thợ có lịch"
                >
                  Xác nhận lịch
                </button>
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAppointment._id, 'in_progress')}
                  className={`py-2 px-2.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedAppointment.status === 'in_progress'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-purple-400 border border-purple-900/60 hover:bg-purple-950/50'
                  }`}
                  title="Khách đang ngồi cắt tại tiệm"
                >
                  Đang phục vụ
                </button>
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAppointment._id, 'completed')}
                  className={`py-2 px-2.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedAppointment.status === 'completed'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-zinc-900 text-emerald-400 border border-emerald-900/60 hover:bg-emerald-950/50'
                  }`}
                  title="Hoàn tất đơn, ghi nhận doanh thu và trả lại lịch trống"
                >
                  Hoàn tất đơn
                </button>
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedAppointment._id, 'cancelled')}
                  className={`py-2 px-2.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedAppointment.status === 'cancelled'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-zinc-900 text-red-400 border border-red-900/60 hover:bg-red-950/50'
                  }`}
                  title="Hủy đơn hẹn"
                >
                  Hủy đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
