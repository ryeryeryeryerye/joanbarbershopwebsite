import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Clock, AlertCircle } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { AdminServiceItem } from '../types/adminTypes';

interface AdminServicesTabProps {
  onUpdateStats?: () => void;
}

export const AdminServicesTab: React.FC<AdminServicesTabProps> = ({ onUpdateStats }) => {
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 100000,
    imageUrl: '',
    isActive: true,
  });

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllServices(true);
      const data = res?.data || (res as unknown as AdminServiceItem[]);
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch {
      setError('Không thể tải danh sách dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      durationMinutes: 30,
      price: 100000,
      imageUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: AdminServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      durationMinutes: service.durationMinutes || 30,
      price: service.price || 0,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên dịch vụ');
      return;
    }
    if (formData.price < 0) {
      setError('Giá dịch vụ không được âm');
      return;
    }

    try {
      if (editingService) {
        await adminApi.updateService(editingService._id, formData);
        setSuccess('Cập nhật dịch vụ thành công!');
      } else {
        await adminApi.createService(formData);
        setSuccess('Thêm dịch vụ mới thành công!');
      }
      setIsModalOpen(false);
      fetchServices();
      onUpdateStats?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Có lỗi xảy ra khi lưu dịch vụ. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteService(id);
      setSuccess('Đã xóa dịch vụ thành công!');
      setDeleteConfirmId(null);
      fetchServices();
      onUpdateStats?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Không thể xóa dịch vụ này.');
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            Quản Lý Danh Sách Dịch Vụ
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Thêm, chỉnh sửa thông tin giá và quản lý hiển thị các gói dịch vụ
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cta-orange hover:bg-orange-600 text-white text-xs font-bold rounded uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-md shadow-orange-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Dịch Vụ Mới</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm dịch vụ theo tên..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cta-orange"
        />
      </div>

      {/* Services Table */}
      <div className="border border-zinc-800 rounded bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Dịch vụ</th>
                <th className="py-3 px-4">Thời lượng</th>
                <th className="py-3 px-4">Đơn giá</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách dịch vụ...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Chưa có dịch vụ nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-12 h-12 rounded object-cover border border-zinc-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 flex-shrink-0 text-[10px]">
                            NO IMG
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm">{service.name}</p>
                          <p className="text-zinc-400 text-[11px] truncate max-w-xs mt-0.5">
                            {service.description || 'Chưa có mô tả'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-300">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{service.durationMinutes} phút</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-orange-400 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      {service.isActive ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                          Đang phục vụ
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Tạm ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(service)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 transition-colors"
                          title="Chỉnh sửa dịch vụ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(service._id)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Xóa dịch vụ"
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

      {/* Modal Thêm / Chỉnh Sửa Dịch Vụ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Cắt tóc phong cách Fade"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Mô tả dịch vụ
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả các bước thực hiện hoặc đặc điểm dịch vụ..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Thời lượng (phút) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Giá dịch vụ (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Link ảnh dịch vụ (URL)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveService"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-cta-orange focus:ring-0 focus:ring-offset-0 bg-zinc-900 cursor-pointer"
                />
                <label htmlFor="isActiveService" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  Kích hoạt hiển thị cho khách đặt
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded uppercase transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cta-orange hover:bg-orange-600 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-md shadow-orange-950/40"
                >
                  {editingService ? 'Lưu Thay Đổi' : 'Tạo Dịch Vụ'}
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
              <h4 className="text-sm font-bold text-white uppercase">Xác Nhận Xóa Dịch Vụ</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Bạn có chắc chắn muốn xóa vĩnh viễn dịch vụ này không? Thao tác này không thể hoàn tác.
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
