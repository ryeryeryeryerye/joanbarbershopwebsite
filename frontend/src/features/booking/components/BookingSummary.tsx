import React from 'react';
import { Scissors, User, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { BookingStepData } from '../types/bookingTypes';
import { formatCurrency } from '@/utils';

interface BookingSummaryProps {
  step: number;
  data: BookingStepData;
  onNext: () => void;
  onPrev: () => void;
  onConfirm: () => void;
  canProceed: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  step,
  data,
  onNext,
  onPrev,
  onConfirm,
  canProceed,
}) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 lg:p-7 sticky top-28 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          TÓM TẮT ĐẶT LỊCH
        </h3>
        <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded border border-orange-900/60">
          BƯỚC {step} / 4
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* 1. DỊCH VỤ */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-500 font-medium">Dịch vụ đã chọn</p>
            {data.serviceName ? (
              <div className="mt-1">
                <p className="font-bold text-white text-sm truncate">{data.serviceName}</p>
                <div className="flex items-center justify-between mt-1 text-zinc-400">
                  <span>{data.serviceDuration || 30} phút</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(data.servicePrice || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic mt-1">Chưa chọn dịch vụ</p>
            )}
          </div>
        </div>

        {/* 2. THỢ CẮT TÓC */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-500 font-medium">Thợ cắt tóc</p>
            {data.barberName ? (
              <div className="mt-1">
                <p className="font-bold text-white text-sm truncate">{data.barberName}</p>
                <p className="text-zinc-400">{data.barberTitle || 'Stylist chuyên nghiệp'}</p>
              </div>
            ) : (
              <p className="text-zinc-500 italic mt-1">Chưa chọn thợ</p>
            )}
          </div>
        </div>

        {/* 3. NGÀY & GIỜ HẸN */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-500 font-medium">Thời gian hẹn</p>
            {data.date && data.timeSlot ? (
              <div className="mt-1">
                <p className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{data.timeSlot}</span>
                </p>
                <p className="text-zinc-400 mt-0.5">Ngày: {data.date}</p>
              </div>
            ) : (
              <p className="text-zinc-500 italic mt-1">Chưa chọn ngày giờ</p>
            )}
          </div>
        </div>
      </div>

      {/* TỔNG TIỀN */}
      <div className="pt-4 border-t border-zinc-800 flex items-end justify-between">
        <div>
          <span className="text-xs text-zinc-400 block">Tạm tính thanh toán</span>
          <span className="text-[11px] text-zinc-500 italic">(Thanh toán trực tiếp tại tiệm)</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-white tracking-tight">
            {formatCurrency(data.servicePrice || 0)}
          </span>
        </div>
      </div>

      {/* CÁC NÚT ĐIỀU HƯỚNG BƯỚC */}
      <div className="space-y-3 pt-2">
        {step < 4 ? (
          <Button
            variant="cta"
            size="lg"
            className="w-full gap-2 shadow-lg shadow-orange-950/40"
            disabled={!canProceed}
            onClick={onNext}
          >
            <span>TIẾP TỤC BƯỚC TIẾP THEO</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="cta"
            size="lg"
            className="w-full gap-2 shadow-xl shadow-orange-950/60"
            disabled={!canProceed}
            onClick={onConfirm}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>XÁC NHẬN ĐẶT LỊCH NGAY</span>
          </Button>
        )}

        {step > 1 && (
          <Button
            variant="outline"
            size="md"
            className="w-full gap-2 border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white"
            onClick={onPrev}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY LẠI BƯỚC TRƯỚC</span>
          </Button>
        )}
      </div>

      <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
        * Giữ chỗ trong 15 phút. Bạn có thể đổi lịch hoặc hủy miễn phí trước giờ hẹn.
      </div>
    </div>
  );
};

