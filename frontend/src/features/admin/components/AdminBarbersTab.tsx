import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Star, Award, AlertCircle } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { AdminBarberItem } from '../types/adminTypes';

interface AdminBarbersTabProps {
  onUpdateStats?: () => void;
}

export const AdminBarbersTab: React.FC<AdminBarbersTabProps> = ({ onUpdateStats }) => {
  const [barbers, setBarbers] = useState<AdminBarberItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<AdminBarberItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: 'Senior Barber',
    experienceYears: 3,
    rating: 5.0,
    reviewCount: 0,
    specialty: '',
    imageUrl: '',
    isActive: true,
  });

  const fetchBarbers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllBarbers(true);
      const data = res?.data || (res as unknown as AdminBarberItem[]);
      if (Array.isArray(data)) {
        setBarbers(data);
      }
    } catch {
      setError('Không thể tải danh sách thợ cắt tóc');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const openCreateModal = () => {
    setEditingBarber(null);
    setFormData({
      name: '',
      title: 'Senior Barber',
      experienceYears: 3,
      rating: 5.0,
      reviewCount: 0,
      specialty: '',
      imageUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (barber: AdminBarberItem) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name,
      title: barber.title,
      experienceYears: barber.experienceYears ?? 3,
      rating: barber.rating ?? 5.0,
      reviewCount: barber.reviewCount ?? 0,
      specialty: barber.specialty || '',
      imageUrl: barber.imageUrl || '',
      isActive: barber.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên thợ cắt tóc');
      return;
    }
    if (!formData.title.trim()) {
      setError('Vui lòng nhập chức danh');
      return;
    }

    try {
      if (editingBarber) {
        await adminApi.updateBarber(editingBarber._id, formData);
        setSuccess('Cập nhật thông tin thợ thành công!');
      } else {
        await adminApi.createBarber(formData);
        setSuccess('Thêm thợ mới thành công!');
      }
      setIsModalOpen(false);
      fetchBarbers();
      onUpdateStats?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Có lỗi xảy ra khi lưu thông tin thợ cắt tóc.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteBarber(id);
      setSuccess('Đã xóa thợ cắt tóc thành công!');
      setDeleteConfirmId(null);
      fetchBarbers();
      onUpdateStats?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Không thể xóa thợ này.');
    }
  };

  const filteredBarbers = barbers.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.specialty && b.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            Quản Lý Đội Ngũ Thợ Cắt Tóc
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Thêm, cập nhật profile, năm kinh nghiệm và trạng thái làm việc của thợ
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cta-orange hover:bg-orange-600 text-white text-xs font-bold rounded uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-md shadow-orange-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Thợ Mới</span>
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
          placeholder="Tìm kiếm thợ theo tên, chức danh, sở trường..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cta-orange"
        />
      </div>

      {/* Barbers Table */}
      <div className="border border-zinc-800 rounded bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Thợ Cắt Tóc</th>
                <th className="py-3 px-4">Chức danh</th>
                <th className="py-3 px-4">Kinh nghiệm</th>
                <th className="py-3 px-4">Đánh giá</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách thợ cắt tóc...
                  </td>
                </tr>
              ) : filteredBarbers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Chưa có thợ cắt tóc nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredBarbers.map((barber) => (
                  <tr key={barber._id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {barber.imageUrl ? (
                          <img
                            src={barber.imageUrl}
                            alt={barber.name}
                            className="w-12 h-12 rounded object-cover border border-zinc-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 flex-shrink-0 text-[10px]">
                            NO IMG
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm">{barber.name}</p>
                          <p className="text-zinc-400 text-[11px] truncate max-w-xs mt-0.5">
                            {barber.specialty ? `Sở trường: ${barber.specialty}` : 'Đa dạng kiểu tóc'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-300">
                      {barber.title}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <span className="inline-flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{barber.experienceYears} năm</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-orange-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-orange-400" />
                          <span>{Number(barber.rating).toFixed(1)}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          ({barber.reviewCount} đánh giá)
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {barber.isActive ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                          Đang làm việc
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Tạm nghỉ
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(barber)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 transition-colors"
                          title="Chỉnh sửa thợ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(barber._id)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Xóa thợ"
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

      {/* Modal Thêm / Chỉnh Sửa Thợ */}
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
                {editingBarber ? 'Chỉnh Sửa Thông Tin Thợ' : 'Thêm Thợ Mới'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Họ và tên thợ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Alex Trần"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Chức danh / Vị trí *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Master Barber / Founder"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Năm kinh nghiệm
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Đánh giá sao (1 - 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Số lượt đánh giá
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.reviewCount}
                    onChange={(e) => setFormData({ ...formData, reviewCount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Sở trường tạo kiểu
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ví dụ: Skin Fade, Classic Pompadour, Uốn Phồng..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cta-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Link ảnh chân dung (URL)
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
                  id="isActiveBarber"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-cta-orange focus:ring-0 focus:ring-offset-0 bg-zinc-900 cursor-pointer"
                />
                <label htmlFor="isActiveBarber" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  Đang làm việc tại tiệm (Hiển thị trong bước chọn thợ)
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
                  {editingBarber ? 'Lưu Thay Đổi' : 'Tạo Thợ Mới'}
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
              <h4 className="text-sm font-bold text-white uppercase">Xác Nhận Xóa Thợ</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Bạn có chắc chắn muốn xóa thợ cắt tóc này khỏi hệ thống không?
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
