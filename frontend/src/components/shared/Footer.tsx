import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import logoImg from '@/assets/images/logo.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-20 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* CỘT 1: LOGO CHÍNH HÃNG DUY NHẤT (KHÔNG KÈM TEXT) */}
          <div className="space-y-4">
            <Link to="/" className="inline-block transition-transform duration-200 hover:scale-105">
              <img
                src={logoImg}
                alt="JOAN BARBERSHOP EST. 2022"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              Không gian cắt tóc và chăm sóc diện mạo chuyên nghiệp dành riêng cho quý ông hiện đại. Tỉ mỉ trong từng đường kéo, khẳng định chất riêng bản lĩnh.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-300 pt-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Cam kết bảo hành kiểu tóc trong 7 ngày</span>
            </div>
          </div>

          {/* CỘT 2: ĐIỀU HƯỚNG NHANH */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2.5">
              ĐIỀU HƯỚNG
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/" className="hover:text-orange-400 transition-colors">Trang chủ</a>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-400 transition-colors">Danh sách dịch vụ</a>
              </li>
              <li>
                <a href="#barbers" className="hover:text-orange-400 transition-colors">Đội ngũ thợ tóc</a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-400 transition-colors">Về Barbershop</a>
              </li>
              <li>
                <a href="#booking" className="hover:text-orange-400 transition-colors">Đặt lịch trực tuyến</a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: GIỜ PHỤC VỤ */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2.5">
              GIỜ MỞ CỬA
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-zinc-300 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Thứ Hai – Thứ Sáu</p>
                  <p className="text-zinc-500">08:30 – 21:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-zinc-300 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Thứ Bảy – Chủ Nhật</p>
                  <p className="text-zinc-500">08:00 – 21:30</p>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 italic pt-1">
                * Quý khách nên đặt lịch trước để được phục vụ chu đáo nhất.
              </p>
            </div>
          </div>

          {/* CỘT 4: THÔNG TIN LIÊN HỆ */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-orange-500 pl-2.5">
              LIÊN HỆ
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-300 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300 leading-relaxed">
                  Số 68 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                <span className="text-white font-semibold">Hotline: 0988.123.456</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                <span>contact@joanbarber.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} JOAN BARBER SHOP. Bản quyền thuộc về dự án Đặt Lịch Cắt Tóc Nam Trực Tuyến.</p>
          <div className="flex items-center space-x-6 text-zinc-400">
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Điều khoản dịch vụ</span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Quy chế hoạt động</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
