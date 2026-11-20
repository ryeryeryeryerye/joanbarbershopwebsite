import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, CalendarCheck, LayoutDashboard } from 'lucide-react';
import logoImg from '@/assets/images/logo.jpg';
import { useAuth } from '@/features/auth';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // State theo dõi mục đang được chọn
  const [activeNav, setActiveNav] = useState<string>('TRANG CHỦ');

  const navLinks = [
    { name: 'TRANG CHỦ', path: '/', hash: '' },
    { name: 'DỊCH VỤ', path: '/#services', hash: '#services' },
    { name: 'THỢ TÓC', path: '/#barbers', hash: '#barbers' },
    { name: 'GIỚI THIỆU', path: '/#about', hash: '#about' },
  ];

  const getAccountInitial = (name?: string) => {
    if (!name || !name.trim()) return 'U';
    // Lấy chữ cái đầu tiên của tên account (ví dụ: "admin joan barbershop" -> chữ "A")
    return name.trim().charAt(0).toUpperCase();
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/appointments' } } });
    } else {
      navigate('/appointments');
    }
  };

  const handleNavClick = (
    e: React.MouseEvent,
    link: { name: string; path: string; hash: string }
  ) => {
    e.preventDefault();
    setActiveNav(link.name);
    setMobileMenuOpen(false);

    if (!link.hash) {
      if (link.path === '/') {
        if (location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/');
        }
      } else {
        navigate(link.path);
      }
      return;
    }

    const sectionId = link.hash.replace('#', '');
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* PHẦN 1: LOGO BÊN TRÁI (KHÔNG CÓ TEXT) */}
        <div className="w-40 sm:w-48 flex items-center justify-start flex-shrink-0">
          <Link
            to="/"
            onClick={() => {
              setActiveNav('TRANG CHỦ');
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center group transition-transform duration-200 hover:scale-105"
            aria-label="JOAN BARBERSHOP"
          >
            <img
              src={logoImg}
              alt="JOAN BARBERSHOP"
              className="h-16 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.45)]"
            />
          </Link>
        </div>

        {/* PHẦN 2: NAVIGATION MENU CĂN CHÍNH GIỮA (DỊCH SANG PHẢI 1 TÍ ĐỂ CÂN BẰNG THỊ GIÁC) */}
        <nav className="hidden md:flex flex-1 items-center justify-center pl-6 lg:pl-10 space-x-2 lg:space-x-3">
          {navLinks.map((link) => {
            const isSelected =
              activeNav === link.name ||
              (link.path === '/' && location.pathname === '/' && activeNav === 'TRANG CHỦ');

            return (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all duration-200 uppercase rounded-md transform hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-cta-orange text-white shadow-md shadow-orange-950/40 font-bold'
                    : 'text-zinc-300 hover:text-orange-400 bg-transparent hover:bg-zinc-900/60'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* PHẦN 3: ICON USER VÀ ICON 3 VẠCH BÊN PHẢI (CHỈ ĐỂ ICON, KHÔNG VIỀN KHÔNG BOX VUÔNG) */}
        <div className="w-40 sm:w-48 hidden md:flex items-center justify-end gap-2 flex-shrink-0">
          {/* NÚT QUẢN TRỊ ADMIN CHO TÀI KHOẢN ADMIN */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              title="Trang quản trị Admin"
              className="p-2 text-zinc-300 hover:text-orange-400 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}

          {/* GIỎ HÀNG / LỊCH ĐẶT */}
          <button
            type="button"
            title="Lịch đặt của bạn"
            onClick={handleCartClick}
            className="p-2 text-zinc-300 hover:text-orange-400 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <CalendarCheck className="w-5 h-5" />
          </button>

          {/* MỤC USER / LOGIN: ICON USER (HOẶC AVATAR TRÒN KHI ĐÃ ĐĂNG NHẬP) */}
          <Link
            to={isAuthenticated ? '/profile' : '/auth/login'}
            title={isAuthenticated ? `Tài khoản: ${user?.name || ''}` : 'Đăng nhập tài khoản'}
            className="p-1.5 text-zinc-300 hover:text-orange-400 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            {isAuthenticated ? (
              <span className="w-8 h-8 rounded-full bg-zinc-800 text-white font-black text-xs border-2 border-cta-orange hover:border-orange-400 flex items-center justify-center select-none shadow-md shadow-orange-950/40">
                {getAccountInitial(user?.name)}
              </span>
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>

          {/* MỤC SETTING: CHỈ ICON 3 VẠCH */}
          <button
            type="button"
            title="Cài đặt & Tùy chọn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-orange-400 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* MOBILE MENU TOGGLE (MÀN HÌNH NHỎ) */}
        <div className="md:hidden flex items-center gap-1.5">
          {/* QUẢN TRỊ ADMIN TRÊN MOBILE */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              title="Quản trị"
              className="p-2 text-zinc-400 hover:text-orange-400 transition-colors flex items-center justify-center"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}

          {/* GIỎ HÀNG MOBILE */}
          <button
            type="button"
            title="Lịch đặt của bạn"
            onClick={handleCartClick}
            className="p-2 text-zinc-400 hover:text-orange-400 transition-colors flex items-center justify-center"
          >
            <CalendarCheck className="w-5 h-5" />
          </button>
          <Link
            to={isAuthenticated ? '/profile' : '/auth/login'}
            className="p-1.5 text-zinc-400 hover:text-orange-400 transition-colors flex items-center justify-center"
            title={isAuthenticated ? `Tài khoản: ${user?.name || ''}` : 'Đăng nhập'}
          >
            {isAuthenticated ? (
              <span className="w-7 h-7 rounded-full bg-zinc-800 text-white font-black text-xs border border-cta-orange flex items-center justify-center">
                {getAccountInitial(user?.name)}
              </span>
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-orange-400 transition-colors flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="border-b border-dark-border bg-dark-surface px-4 py-4 space-y-2 animate-fadeIn">
          <nav className="flex flex-col space-y-1.5 max-w-md mx-auto">
            {navLinks.map((link) => {
              const isSelected = activeNav === link.name;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-3 py-2 text-sm font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
                    isSelected
                      ? 'bg-cta-orange text-white'
                      : 'text-zinc-300 hover:text-orange-400 bg-transparent'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
