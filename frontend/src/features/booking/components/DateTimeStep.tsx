import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock } from 'lucide-react';
import { BookingStepData } from '../types/bookingTypes';
import { SHOP_TIME_PERIODS } from '../constants/timeSlots';
import { axiosClient } from '@/lib';

interface DateTimeStepProps {
  selectedDate?: string;
  selectedTimeSlot?: string;
  selectedBarberId?: string;
  onSelect: (dateTime: Partial<BookingStepData>) => void;
}

const formatLocalDate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Hàm sinh danh sách 7 ngày kể từ hôm nay
const getNext7Days = () => {
  const days = [];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = formatLocalDate(d);
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

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTimeSlot,
  selectedBarberId,
  onSelect,
}) => {
  const daysList = getNext7Days();
  const currentDate = selectedDate || daysList[0].dateStr;
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    axiosClient
      .get('/appointments/booked-slots', {
        params: {
          date: currentDate,
          barberId: selectedBarberId,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const slots = res?.data || res;
        if (mounted && Array.isArray(slots)) {
          setBookedSlots(slots);
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      mounted = false;
    };
  }, [currentDate, selectedBarberId]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          <span>Bước 3: Chọn Ngày & Khung Giờ Cắt Tóc</span>
        </h2>
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
        <div>
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
            2. CHỌN KHUNG GIỜ (MỖI 30 PHÚT)
          </label>
        </div>

        <div className="space-y-6">
          {SHOP_TIME_PERIODS.map((period) => {
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

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {period.slots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    const isBooked = bookedSlots.includes(slot.time);

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSelect({ timeSlot: slot.time })}
                        title={isBooked ? 'Khung giờ này đã kín lịch' : slot.time}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all duration-200 text-center ${
                          isBooked
                            ? 'bg-zinc-950/70 border-zinc-800 text-zinc-600 cursor-not-allowed line-through opacity-50'
                            : isSelected
                            ? 'bg-cta-orange border-cta-orange text-white shadow-md shadow-orange-950/40 ring-1 ring-orange-500 transform hover:-translate-y-0.5'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-cta-orange hover:text-white hover:bg-zinc-800 transform hover:-translate-y-0.5'
                        }`}
                      >
                        {isBooked ? (
                          <Lock className="w-3 h-3 inline mr-1 opacity-50" />
                        ) : (
                          <Clock className="w-3 h-3 inline mr-1 opacity-70" />
                        )}
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
