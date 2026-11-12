import React from 'react';
import { CalendarCheck, Clock, Scissors, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppointmentList: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:border-cta-orange hover:bg-cta-orange transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            title="Về trang chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Lịch Đặt Của Bạn</h1>
            <p className="text-zinc-400 text-sm mt-0.5">Theo dõi các lịch hẹn đã đặt tại Joan Barbershop</p>
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-14 flex flex-col items-center justify-center text-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <CalendarCheck className="w-9 h-9 text-zinc-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cta-orange/10 border border-cta-orange/40 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-cta-orange" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Chưa có lịch hẹn nào</h2>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Bạn chưa đặt lịch nào. Hãy đặt lịch cắt tóc ngay để không phải chờ đợi!
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cta-orange hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              <Clock className="w-4 h-4" />
              Đặt lịch ngay
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-semibold border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Xem dịch vụ
            </Link>
          </div>
        </div>

        {/* Coming soon note */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          Tính năng quản lý lịch hẹn đầy đủ sẽ sớm ra mắt.
        </p>
      </div>
    </div>
  );
};
