import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy đường dẫn trước đó nếu được redirect từ ProtectedRoute
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation cơ bản
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ phone: phone.trim(), password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/90 border border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Đăng Nhập
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Chào mừng trở lại với <span className="text-zinc-200 font-medium">JOAN BARBERSHOP</span>
          </p>
        </div>

        {/* Thông báo lỗi tổng quát */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form đăng nhập */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Ô nhập Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
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
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ví dụ: 0988123456"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-cta-orange focus:ring-1 focus:ring-cta-orange transition-colors"
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-cta-orange focus:ring-1 focus:ring-cta-orange transition-colors"
              />
            </div>
          </div>

          {/* Nút Đăng nhập (Màu cam CTA) */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="cta"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </Button>
          </div>
        </form>

        {/* Chuyển sang Đăng ký */}
        <div className="pt-4 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
          Chưa có tài khoản?{' '}
          <Link
            to="/auth/register"
            state={{ from: location.state?.from || { pathname: from } }}
            className="text-white hover:text-cta-orange font-semibold inline-flex items-center gap-1 transition-colors"
          >
            Đăng ký ngay <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export LoginForm alias để backward-compatible
export const LoginForm = LoginPage;

