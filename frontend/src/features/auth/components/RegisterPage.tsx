import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Phone, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    global?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường đang gõ
    if (errors[name as keyof typeof errors] || errors.global) {
      setErrors((prev) => ({ ...prev, [name]: undefined, global: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await register({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrors((prev) => ({
        ...prev,
        global: apiErr?.message || 'Đăng ký không thành công. Vui lòng thử lại.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/90 border border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Đăng Ký Tài Khoản
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Tạo tài khoản thành viên để đặt lịch nhanh chóng tại JOAN BARBERSHOP
          </p>
        </div>

        {/* Global Error */}
        {errors.global && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errors.global}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Họ và Tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn Nam"
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Số Điện Thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ví dụ: 0988123456"
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>

          {/* Mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                }`}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Xác Nhận Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-cta-orange focus:ring-1 focus:ring-cta-orange'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Nút Đăng ký (CTA cam) */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="cta"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ TÀI KHOẢN'}
            </Button>
          </div>
        </form>

        {/* Chuyển sang Đăng nhập */}
        <div className="pt-4 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
          Đã có tài khoản?{' '}
          <Link
            to="/auth/login"
            className="text-white hover:text-cta-orange font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

