import React from 'react';
import { Star, Check, Zap, UserCheck } from 'lucide-react';
import { BookingStepData } from '../types/bookingTypes';

interface BarberOption {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialty: string;
  imageUrl?: string;
  isRandom?: boolean;
}

const BARBER_OPTIONS: BarberOption[] = [
  {
    id: 'any',
    name: 'Thợ Bất Kỳ',
    title: 'Tiệm tự sắp xếp thợ phục vụ ngay',
    experienceYears: 5,
    rating: 5.0,
    reviewCount: 500,
    specialty: 'Phù hợp mọi kiểu tóc nam',
    isRandom: true,
  },
  {
    id: 'barber-1',
    name: 'Alex Trần',
    title: 'Master Barber / Founder',
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 186,
    specialty: 'Skin Fade & Classic Pompadour',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'barber-2',
    name: 'Hoàng Barber',
    title: 'Senior Stylist',
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 142,
    specialty: 'Modern Crop & Taper Fade',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'barber-3',
    name: 'David Nguyễn',
    title: 'Creative Director',
    experienceYears: 8,
    rating: 5.0,
    reviewCount: 165,
    specialty: 'Uốn Phồng & Nhuộm Thời Trang',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'barber-4',
    name: 'Minh Quân',
    title: 'Senior Barber',
    experienceYears: 6,
    rating: 4.9,
    reviewCount: 128,
    specialty: 'Side Part 7/3 & Cạo Khăn Nóng',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'barber-5',
    name: 'Kenny Vũ',
    title: 'Lead Barber',
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 98,
    specialty: 'Mullet Nam Tính & Textured Quiff',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
  },
];

interface BarberStepProps {
  selectedBarberId?: string;
  onSelect: (barber: Partial<BookingStepData>) => void;
}

export const BarberStep: React.FC<BarberStepProps> = ({ selectedBarberId, onSelect }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-orange-400" />
          <span>Bước 2: Chọn Thợ Cắt Tóc Yêu Thích</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Chọn thợ quen tay để được tư vấn và tạo kiểu chuẩn xác theo phong cách của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BARBER_OPTIONS.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          return (
            <div
              key={barber.id}
              onClick={() =>
                onSelect({
                  barberId: barber.id,
                  barberName: barber.name,
                  barberTitle: barber.title,
                  barberImage: barber.imageUrl,
                })
              }
              className={`group relative rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 ${isSelected
                  ? 'bg-zinc-900 border-cta-orange shadow-lg shadow-orange-950/30 ring-1 ring-orange-500'
                  : 'bg-dark-card border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/90'
                }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cta-orange text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="flex gap-4 items-center">
                {barber.isRandom ? (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8" />
                  </div>
                ) : (
                  <img
                    src={barber.imageUrl}
                    alt={barber.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-zinc-700 group-hover:scale-105 transition-transform"
                  />
                )}

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {barber.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">{barber.title}</p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Star className="w-3.5 h-3.5 fill-orange-400" />
                      <span className="font-semibold">{barber.rating.toFixed(1)}</span>
                    </span>
                    <span>•</span>
                    <span>{barber.experienceYears} năm KN</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                  Sở trường: <span className="text-zinc-200 font-medium">{barber.specialty}</span>
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${isSelected
                      ? 'bg-cta-orange text-white'
                      : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                    }`}
                >
                  {isSelected ? 'ĐÃ CHỌN' : 'CHỌN THỢ'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

