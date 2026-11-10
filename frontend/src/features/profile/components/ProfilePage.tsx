import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Shield, LogOut, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Họ và tên không được để trống');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setErrorMessage('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });
      setSuccessMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMessage(apiErr?.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Quản Trị Viên (Admin)',
          bg: 'bg-red-950/60 text-red-300 border-red-800',
        };
      case 'barber':
        return {
          label: 'Thợ Tóc (Barber)',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800',
        };
      default:
        return {
          label: 'Khách Hàng (Customer)',
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="min-h-[75vh] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Card Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-cta-orange flex items-center justify-center text-white shadow-lg shadow-orange-950/40">
                <User className="w-8 h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <p className="text-sm text-zinc-400">{user?.phone}</p>
              </div>
            </div>

            {/* Role Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${roleInfo.bg}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{roleInfo.label}</span>
            </div>
          </div>

          {/* Alert Messages */}
          {successMessage && (
            <div className="mt-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-emerald-400 text-sm">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Thông tin */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white transition-colors ${
                    isEditing
                      ? 'bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                      : 'bg-zinc-950/50 border border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Số Điện Thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white transition-colors ${
                    isEditing
                      ? 'bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                      : 'bg-zinc-950/50 border border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80">
              {isEditing ? (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="submit"
                    variant="cta"
                    size="md"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setIsEditing(false);
                      setErrorMessage(null);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                      });
                    }}
                    className="w-full sm:w-auto"
                  >
                    HỦY
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccessMessage(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  CHỈNH SỬA THÔNG TIN
                </Button>
              )}

              {/* Nút Đăng xuất */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-red-400 hover:text-white bg-red-950/30 hover:bg-red-800 border border-red-900/60 hover:border-red-700 rounded-md uppercase transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ĐĂNG XUẤT</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

