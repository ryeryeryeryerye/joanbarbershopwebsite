import { Sun, Sunset, Moon, LucideIcon } from 'lucide-react';

export interface TimeSlot {
  time: string;
}

export interface TimePeriod {
  name: string;
  icon: LucideIcon;
  slots: TimeSlot[];
}

// Khung giờ mở cửa shop: 08:30 - 21:00, mỗi khung giờ cách nhau 30 phút
export const SHOP_TIME_PERIODS: TimePeriod[] = [
  {
    name: 'Buổi Sáng (08:30 - 12:00)',
    icon: Sun,
    slots: [
      { time: '08:30' },
      { time: '09:00' },
      { time: '09:30' },
      { time: '10:00' },
      { time: '10:30' },
      { time: '11:00' },
      { time: '11:30' },
      { time: '12:00' },
    ],
  },
  {
    name: 'Buổi Chiều (12:30 - 17:30)',
    icon: Sunset,
    slots: [
      { time: '12:30' },
      { time: '13:00' },
      { time: '13:30' },
      { time: '14:00' },
      { time: '14:30' },
      { time: '15:00' },
      { time: '15:30' },
      { time: '16:00' },
      { time: '16:30' },
      { time: '17:00' },
      { time: '17:30' },
    ],
  },
  {
    name: 'Buổi Tối (18:00 - 21:00)',
    icon: Moon,
    slots: [
      { time: '18:00' },
      { time: '18:30' },
      { time: '19:00' },
      { time: '19:30' },
      { time: '20:00' },
      { time: '20:30' },
      { time: '21:00' },
    ],
  },
];

// Danh sách tất cả các khung giờ dạng phẳng
export const ALL_SHOP_TIME_SLOTS: string[] = SHOP_TIME_PERIODS.flatMap((p) =>
  p.slots.map((s) => s.time)
);

