import React from 'react';
import { Calendar, Clock, Sun, Sunset, Moon } from 'lucide-react';
import { BookingStepData } from '../types/bookingTypes';

interface DateTimeStepProps {
  selectedDate?: string;
  selectedTimeSlot?: string;
  onSelect: (dateTime: Partial<BookingStepData>) => void;
}

// Hàm sinh danh sách 7 ngày kể từ hôm nay
const getNext7Days = () => {
  const days = [];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const isTomorrow = i === 1;
    let label = `${dayNames[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
    if (isToday) label = `Hôm nay, ${d.getDate()}/${d.getMonth() + 1}`;
    if (isTomorrow) label = `Ngày mai, ${d.getDate()}/${d.getMonth() + 1}`;

    days.push({
      dateStr,
      dayName: dayNames[d.getDay()],
      dateNum: d.getDate(),
      monthNum: d.getMonth() + 1,
      label,
      isToday,
    });
  }
  return days;
};

// Khung giờ theo 3 buổi
const TIME_PERIODS = [
  {
    name: 'Buổi Sáng',
    icon: Sun,
    slots: [
      { time: '08:30', isBusy: false },
      { time: '09:15', isBusy: false },
      { time: '10:00', isBusy: true },
      { time: '10:45', isBusy: false },
      { time: '11:30', isBusy: false },
    ],
  },
  {
    name: 'Buổi Chiều',
    icon: Sunset,
    slots: [
      { time: '13:30', isBusy: false },
      { time: '14:15', isBusy: false },
      { time: '15:00', isBusy: true },
      { time: '15:45', isBusy: false },
      { time: '16:30', isBusy: false },
      { time: '17:15', isBusy: false },
    ],
  },
  {
    name: 'Buổi Tối',
    icon: Moon,
    slots: [
      { time: '18:00', isBusy: false },
      { time: '18:45', isBusy: true },
      { time: '19:30', isBusy: false },
      { time: '20:15', isBusy: false },
    ],
  },
];

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelect,
}) => {
  const daysList = getNext7Days();
  const currentDate = selectedDate || daysList[0].dateStr;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          <span>Bước 3: Chọn Ngày & Khung Giờ Cắt Tóc</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Chọn khung giờ phù hợp để được tiếp đón chu đáo và không mất thời gian chờ đợi.
        </p>
      </div>

      {/* 1. CHỌN NGÀY */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          1. CHỌN NGÀY HẸN
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {daysList.map((day) => {
            const isSelected = currentDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onSelect({ date: day.dateStr })}
                className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-cta-orange border-cta-orange text-white shadow-lg shadow-orange-950/40 ring-2 ring-orange-500'
                    : 'bg-dark-card border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                <span className="block text-[11px] font-semibold opacity-80 uppercase tracking-wider">
                  {day.dayName}
                </span>
                <span className="block text-lg font-black mt-0.5">
                  {day.dateNum}/{day.monthNum}
                </span>
                {day.isToday && (
                  <span
                    className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-zinc-800 text-orange-400'
                    }`}
                  >
                    Hôm nay
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHỌN KHUNG GIỜ */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
            2. CHỌN GIỜ CÒN TRỐNG
          </label>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span>Còn trống</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Đang chọn</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
              <span className="line-through text-zinc-600">Đã kín</span>
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {TIME_PERIODS.map((period) => {
            const Icon = period.icon;
            return (
              <div
                key={period.name}
                className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800/80 pb-2">
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{period.name}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                  {period.slots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    if (slot.isBusy) {
                      return (
                        <div
                          key={slot.time}
                          className="py-2.5 px-3 rounded-lg bg-zinc-950/60 border border-zinc-900 text-zinc-600 text-xs font-medium text-center line-through cursor-not-allowed select-none"
                        >
                          {slot.time}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => onSelect({ timeSlot: slot.time })}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all duration-200 transform hover:-translate-y-1 ${
                          isSelected
                            ? 'bg-cta-orange border-cta-orange text-white shadow-md shadow-orange-950/40 ring-1 ring-orange-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-cta-orange hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1 opacity-70" />
                        <span>{slot.time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

