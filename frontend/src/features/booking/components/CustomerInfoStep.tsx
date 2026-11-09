import React from 'react';
import { User, Phone, FileText, ShieldCheck, Ticket } from 'lucide-react';
import { BookingStepData } from '../types/bookingTypes';
import { formatCurrency } from '@/utils';
import logoImg from '@/assets/images/logo.jpg';

interface CustomerInfoStepProps {
  data: BookingStepData;
  onChange: (data: Partial<BookingStepData>) => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-400" />
          <span>Bước 4: Thông Tin Đặt Lịch & Xác Nhận</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Vui lòng để lại số điện thoại chính xác để hệ thống gửi tin nhắn xác nhận lịch hẹn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="lg:col-span-7 space-y-5 bg-dark-card border border-dark-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-400" />
            <span>THÔNG TIN KHÁCH HÀNG</span>
          </h3>

          {/* HỌ VÀ TÊN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Họ và tên của bạn *</span>
              <span className="text-[10px] text-zinc-500">Bắt buộc</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={data.customerName || ''}
                onChange={(e) => onChange({ customerName: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-cta-orange focus:ring-1 focus:ring-orange-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* SỐ ĐIỆN THOẠI */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Số điện thoại liên hệ *</span>
              <span className="text-[10px] text-zinc-500">Nhận mã SMS giữ chỗ</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="Ví dụ: 0988 123 456"
                value={data.customerPhone || ''}
                onChange={(e) => onChange({ customerPhone: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-cta-orange focus:ring-1 focus:ring-orange-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* GHI CHÚ YÊU CẦU ĐẶC BIỆT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Ghi chú cho thợ tóc (nếu có)</span>
              <span className="text-[10px] text-zinc-500">Không bắt buộc</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Tôi muốn cạo viền kỹ, giữ phom trên đỉnh tóc để vuốt sáp..."
              value={data.customerNote || ''}
              onChange={(e) => onChange({ customerNote: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-cta-orange focus:ring-1 focus:ring-orange-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400 border-t border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>Thông tin được bảo mật và chỉ dùng để liên hệ phục vụ lịch hẹn.</span>
          </div>
        </div>

        {/* CỘT PHẢI: XEM TRƯỚC PHIẾU ĐẶT CHỖ (APPOINTMENT TICKET PREVIEW) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-black border border-zinc-700 rounded-2xl p-6 space-y-5 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Ticket className="w-4 h-4 text-orange-400" />
              <span>PHIẾU HẸN DỰ KIẾN</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">GENTLEMAN PASS</span>
          </div>

          <div className="text-center py-2">
            <div className="h-16 w-auto mx-auto flex items-center justify-center mb-2">
              <img src={logoImg} alt="Joan Barbershop" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-xs text-zinc-400">JOAN BARBERSHOP • 68 PHỐ HUẾ, HÀ NỘI</p>
          </div>

          <div className="space-y-3 pt-2 text-xs border-t border-dashed border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-500">Khách hàng:</span>
              <span className="text-white font-bold">{data.customerName || 'Quý khách'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Số điện thoại:</span>
              <span className="text-white font-mono">{data.customerPhone || 'Chưa nhập'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Dịch vụ:</span>
              <span className="text-white font-semibold">{data.serviceName || 'Chưa chọn'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Stylist / Thợ:</span>
              <span className="text-white font-semibold">{data.barberName || 'Thợ bất kỳ'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Thời gian hẹn:</span>
              <span className="text-orange-400 font-bold">
                {data.timeSlot} • {data.date}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-sm">
            <span className="text-xs font-bold text-zinc-400 uppercase">TỔNG CỘNG:</span>
            <span className="text-lg font-black text-white">
              {formatCurrency(data.servicePrice || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

