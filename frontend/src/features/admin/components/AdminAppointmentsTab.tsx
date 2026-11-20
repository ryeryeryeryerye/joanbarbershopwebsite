import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  Check,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import {
  AdminAppointmentItem,
  AppointmentStatus,
  AdminBarberItem,
  AdminServiceItem,
} from '../types/adminTypes';

interface AdminAppointmentsTabProps {
  onUpdateStats?: () => void;
}

export const AdminAppointmentsTab: React.FC<AdminAppointmentsTabProps> = ({ onUpdateStats }) => {
  const [appointments, setAppointments] = useState<AdminAppointmentItem[]>([]);
  const [barbers, setBarbers] = useState<AdminBarberItem[]>([]);
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [barberFilter, setBarberFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [viewingAppointment, setViewingAppointment] = useState<AdminAppointmentItem | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<AdminAppointmentItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    date: '',
    timeSlot: '',
    serviceName: '',
    barberName: '',
    note: '',
    status: 'pending' as AppointmentStatus,
  });

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllAppointments();
      const data = res?.data || (res as unknown as AdminAppointmentItem[]);
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch {
      setError('Không thể tải danh sách đơn đặt lịch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    adminApi.getAllBarbers(true).then((res) => {
      const data = res?.data || (res as unknown as AdminBarberItem[]);
      if (Array.isArray(data)) setBarbers(data);
    });
    adminApi.getAllServices(true).then((res) => {
      const data = res?.data || (res as unknown as AdminServiceItem[]);
      if (Array.isArray(data)) setServices(data);
    });
  }, []);

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const res = await adminApi.updateAppointmentStatus(appointmentId, newStatus);
      const updated = res?.data || (res as unknown as AdminAppointmentItem);
      const barberAssigned = updated?.barberName ? ` (Thợ phụ trách: ${updated.barberName})` : '';
      setMessage(`Đã cập nhật trạng thái đơn thành công!${barberAssigned}`);
      fetchAppointments();
      onUpdateStats?.();
      setTimeout(() => setMessage(null), 3500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errText = err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái';
      setError(errText);
      setTimeout(() => setError(null), 5000);
    }
  };

  const openEditModal = (apt: AdminAppointmentItem) => {
    setEditingAppointment(apt);
    setEditFormData({
      date: apt.date,
      timeSlot: apt.timeSlot,
      serviceName: apt.serviceName,
      barberName: apt.barberName,
      note: apt.note || '',
      status: apt.status,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      await adminApi.updateAppointment(editingAppointment._id, editFormData);
      setMessage('Đã cập nhật thông tin đơn đặt lịch!');
      setEditingAppointment(null);
      fetchAppointments();
      onUpdateStats?.();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setError('Lỗi khi cập nhật đơn lịch.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteAppointment(id);
      setMessage('Đã xóa đơn lịch hẹn thành công!');
      setDeleteConfirmId(null);
      fetchAppointments();
      onUpdateStats?.();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setError('Không thể xóa đơn này. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
            Chờ duyệt
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-blue-950/60 text-blue-400 border border-blue-800/60">
            Đã xác nhận
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-purple-950/60 text-purple-400 border border-purple-800/60">
            Đang phục vụ
          </span>
        );
      case 'completed':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            Đã hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-red-950/60 text-red-400 border border-red-800/60">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // Filter Logic
  const filteredAppointments = appointments.filter((apt) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      (apt.bookingCode && apt.bookingCode.toLowerCase().includes(query)) ||
      apt.customerName.toLowerCase().includes(query) ||
      apt.customerPhone.includes(query) ||
      apt.serviceName.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchDate = !dateFilter || apt.date === dateFilter;
    const matchBarber =
      barberFilter === 'all' ||
      (apt.barberId && String(apt.barberId).trim() === String(barberFilter).trim()) ||
      (apt.barberName && apt.barberName.trim().toLowerCase() === barberFilter.trim().toLowerCase());

    return matchSearch && matchStatus && matchDate && matchBarber;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            Quản Lý Đơn Đặt Lịch Của Khách Hàng
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Xem toàn bộ đơn đặt thực tế, lọc đa tiêu chí, duyệt trạng thái và quản lý đơn hẹn
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded uppercase tracking-wider border border-zinc-700 transition-colors"
        >
          Làm mới danh sách
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded bg-dark-card border border-dark-border space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cta-orange"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt (Pending)</option>
              <option value="confirmed">Đã xác nhận (Confirmed)</option>
              <option value="in_progress">Đang phục vụ (In Progress)</option>
              <option value="completed">Đã hoàn thành (Completed)</option>
              <option value="cancelled">Đã hủy (Cancelled)</option>
            </select>
          </div>

          {/* Barber Filter */}
          <div className="relative">
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
            >
              <option value="all">Tất cả thợ</option>
              {barbers.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
            />
          </div>
        </div>

        {/* Clear filter buttons if any active */}
        {(searchQuery || statusFilter !== 'all' || barberFilter !== 'all' || dateFilter) && (
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Tìm thấy <strong className="text-white">{filteredAppointments.length}</strong> đơn phù hợp
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setBarberFilter('all');
                setDateFilter('');
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <div className="border border-zinc-800 rounded bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Dịch vụ</th>
                <th className="py-3 px-4">Thợ cắt</th>
                <th className="py-3 px-4">Lịch hẹn</th>
                <th className="py-3 px-4">Đơn giá</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách đơn đặt lịch...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Chưa có đơn đặt lịch nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-zinc-900/50 transition-colors">
                    {/* Mã đơn */}
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      #{apt.bookingCode || apt._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Khách hàng */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white text-sm">{apt.customerName}</p>
                        <a
                          href={`tel:${apt.customerPhone}`}
                          className="text-zinc-400 text-[11px] hover:text-orange-400 inline-flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{apt.customerPhone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Dịch vụ */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-zinc-200">{apt.serviceName}</p>
                    </td>

                    {/* Thợ cắt */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-zinc-300">{apt.barberName}</span>
                    </td>

                    {/* Lịch hẹn */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">{apt.timeSlot}</p>
                        <p className="text-[11px] text-zinc-400">{apt.date}</p>
                      </div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3.5 px-4 font-bold text-orange-400">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(apt.price)}
                    </td>

                    {/* Trạng thái & Quick change */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(apt.status)}
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt._id, e.target.value as AppointmentStatus)}
                          className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] rounded px-1.5 py-0.5 cursor-pointer focus:outline-none focus:border-cta-orange"
                          title="Thay đổi nhanh trạng thái"
                        >
                          <option value="pending">Chờ duyệt</option>
                          <option value="confirmed">Xác nhận</option>
                          <option value="in_progress">Phục vụ</option>
                          <option value="completed">Xong</option>
                          <option value="cancelled">Hủy</option>
                        </select>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingAppointment(apt)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(apt)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 transition-colors"
                          title="Chỉnh sửa đơn"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(apt._id)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Xóa đơn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem Chi Tiết Đơn */}
      {viewingAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setViewingAppointment(null)}
        >
          <div
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                Chi Tiết Đơn Hẹn #{viewingAppointment.bookingCode || viewingAppointment._id.slice(-6).toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setViewingAppointment(null)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Trạng thái:</span>
                <div>{getStatusBadge(viewingAppointment.status)}</div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Khách hàng:</span>
                <span className="font-bold text-white">{viewingAppointment.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Số điện thoại:</span>
                <a href={`tel:${viewingAppointment.customerPhone}`} className="font-bold text-orange-400">
                  {viewingAppointment.customerPhone}
                </a>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Gói dịch vụ:</span>
                <span className="font-semibold text-zinc-200">{viewingAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Thợ phụ trách:</span>
                <span className="font-semibold text-zinc-200">{viewingAppointment.barberName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Ngày hẹn:</span>
                <span className="font-bold text-white">{viewingAppointment.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Khung giờ:</span>
                <span className="font-bold text-orange-400">{viewingAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <span className="text-zinc-400">Chi phí:</span>
                <span className="font-black text-white text-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewingAppointment.price)}
                </span>
              </div>
              {viewingAppointment.note && (
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">Ghi chú của khách:</span>
                  <p>{viewingAppointment.note}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingAppointment(null)}
                className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded text-xs hover:bg-zinc-800 uppercase"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Đơn Lịch */}
      {editingAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingAppointment(null)}
        >
          <div
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                Chỉnh Sửa Đơn Hẹn #{editingAppointment.bookingCode || editingAppointment._id.slice(-6).toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setEditingAppointment(null)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Khung giờ
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.timeSlot}
                    onChange={(e) => setEditFormData({ ...editFormData, timeSlot: e.target.value })}
                    placeholder="Ví dụ: 09:30"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Dịch vụ
                  </label>
                  <select
                    value={editFormData.serviceName}
                    onChange={(e) => setEditFormData({ ...editFormData, serviceName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Thợ cắt tóc
                  </label>
                  <select
                    value={editFormData.barberName}
                    onChange={(e) => setEditFormData({ ...editFormData, barberName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
                  >
                    <option value="Thợ Bất Kỳ">Thợ Bất Kỳ</option>
                    {barbers.map((b) => (
                      <option key={b._id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Trạng thái đơn
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as AppointmentStatus })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange cursor-pointer"
                >
                  <option value="pending">Chờ duyệt (Pending)</option>
                  <option value="confirmed">Đã xác nhận (Confirmed)</option>
                  <option value="in_progress">Đang phục vụ (In Progress)</option>
                  <option value="completed">Đã hoàn thành (Completed)</option>
                  <option value="cancelled">Đã hủy (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={2}
                  value={editFormData.note}
                  onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange resize-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded uppercase transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cta-orange hover:bg-orange-600 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-md shadow-orange-950/40"
                >
                  Lưu Đơn Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded bg-red-950/40 border border-red-900/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Xác Nhận Xóa Đơn Hẹn</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Bạn có chắc chắn muốn xóa vĩnh viễn đơn lịch hẹn này khỏi hệ thống không?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded text-xs hover:bg-zinc-800 uppercase"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
