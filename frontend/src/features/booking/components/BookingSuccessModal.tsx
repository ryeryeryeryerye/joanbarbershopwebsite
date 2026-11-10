import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, User, Scissors, MapPin, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui';
import { BookingResult } from '../types/bookingTypes';
import { formatCurrency } from '@/utils';
import logoImg from '@/assets/images/logo.jpg';

interface BookingSuccessModalProps {
  isOpen: boolean;
  result: BookingResult | null;
  onClose: () => void;
  onReset: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  result,
  onReset,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-dark-card border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* ICON CHECK HOÀN TẤT */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-950/60 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-950/50 animate-bounce">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            ĐẶT LỊCH THÀNH CÔNG!
          </h3>
          <p className="text-xs text-zinc-400">
            Hệ thống đã ghi nhận lịch hẹn của bạn tại JOAN BARBER SHOP.
          </p>
        </div>

        {/* THẺ TICKET THÔNG TIN LỊCH HẸN */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Joan Barbershop" className="h-8 w-auto object-contain" />
              <span className="text-[11px] font-mono text-zinc-400">MÃ ĐẶT LỊCH</span>
            </div>
            <span className="text-sm font-mono font-black text-orange-400 tracking-wider">
              {result.bookingCode}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-orange-400" /> Dịch vụ:
              </span>
              <span className="text-white font-bold">{result.serviceName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" /> Thợ cắt tóc:
              </span>
              <span className="text-white font-medium">{result.barberName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" /> Thời gian hẹn:
              </span>
              <span className="text-orange-400 font-bold">{result.dateTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> Địa điểm:
              </span>
              <span className="text-zinc-300">68 Phố Huế, Hoàn Kiếm, HN</span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Tổng chi phí:</span>
            <span className="text-lg font-black text-white">
              {formatCurrency(result.totalPrice)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 text-center italic">
          * Vui lòng có mặt đúng giờ trước 5 phút để được phục vụ chu đáo nhất.
        </p>

        {/* NÚT ĐIỀU HƯỚNG */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
            onClick={onReset}
          >
            <span>Đặt thêm lịch khác</span>
          </Button>

          <Link to="/" className="flex-1">
            <Button variant="cta" className="w-full gap-2 shadow-lg shadow-orange-950/40">
              <Home className="w-4 h-4" />
              <span>Về Trang Chủ</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

