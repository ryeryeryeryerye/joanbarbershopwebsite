import React from 'react';
import { Scissors, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { ServiceStep } from './ServiceStep';
import { BarberStep } from './BarberStep';
import { DateTimeStep } from './DateTimeStep';
import { CustomerInfoStep } from './CustomerInfoStep';
import { BookingSummary } from './BookingSummary';
import { BookingSuccessModal } from './BookingSuccessModal';

export const BookingCard: React.FC = () => {
  const {
    step,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    confirmBooking,
    isCompleted,
    bookingResult,
    resetBooking,
  } = useBooking();

  const stepperItems = [
    { num: 1, label: 'Dịch vụ', icon: Scissors },
    { num: 2, label: 'Thợ tóc', icon: User },
    { num: 3, label: 'Ngày & Giờ', icon: Calendar },
    { num: 4, label: 'Xác nhận', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* TIÊU ĐỀ TRANG ĐẶT LỊCH */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          ĐẶT LỊCH CẮT TÓC <span className="text-orange-500">TRỰC TUYẾN</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Chỉ với 4 bước đơn giản, bạn sẽ sở hữu ngay khung giờ vàng cùng stylist tay nghề cao tại JOAN BARBERSHOP.
        </p>
      </div>

      {/* THANH TIẾN TRÌNH STEPPER ĐA BƯỚC */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {stepperItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = step === item.num;
            const isPassed = step > item.num;

            return (
              <button
                key={item.num}
                type="button"
                onClick={() => goToStep(item.num)}
                disabled={item.num > step}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl border text-center transition-all duration-200 ${
                  isCurrent
                    ? 'bg-zinc-900 border-cta-orange text-white shadow-lg shadow-orange-950/30 ring-1 ring-orange-500'
                    : isPassed
                      ? 'bg-zinc-900/60 border-zinc-700 text-orange-400 hover:border-zinc-500 cursor-pointer'
                      : 'bg-dark-card/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-cta-orange text-white'
                      : isPassed
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : item.num}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">
                    Bước {item.num}
                  </span>
                  <span className="text-xs font-bold block">{item.label}</span>
                </div>
                <Icon className="sm:hidden w-4 h-4 mt-1 opacity-70" />
              </button>
            );
          })}
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG CHÍNH (GRID BƯỚC + TÓM TẮT SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT NỘI DUNG BƯỚC ĐANG CHỌN */}
        <div className="lg:col-span-8 bg-dark-card/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          {step === 1 && (
            <ServiceStep
              selectedServiceId={bookingData.serviceId}
              onSelect={(service) => updateBookingData(service)}
            />
          )}

          {step === 2 && (
            <BarberStep
              selectedBarberId={bookingData.barberId}
              onSelect={(barber) => updateBookingData(barber)}
            />
          )}

          {step === 3 && (
            <DateTimeStep
              selectedDate={bookingData.date}
              selectedTimeSlot={bookingData.timeSlot}
              onSelect={(dateTime) => updateBookingData(dateTime)}
            />
          )}

          {step === 4 && (
            <CustomerInfoStep
              data={bookingData}
              onChange={(data) => updateBookingData(data)}
            />
          )}
        </div>

        {/* CỘT TÓM TẮT & NÚT TIẾP TỤC */}
        <div className="lg:col-span-4">
          <BookingSummary
            step={step}
            data={bookingData}
            onNext={nextStep}
            onPrev={prevStep}
            onConfirm={confirmBooking}
            canProceed={canProceed()}
          />
        </div>
      </div>

      {/* MODAL THÀNH CÔNG */}
      <BookingSuccessModal
        isOpen={isCompleted}
        result={bookingResult}
        onClose={resetBooking}
        onReset={resetBooking}
      />
    </div>
  );
};

export default BookingCard;
