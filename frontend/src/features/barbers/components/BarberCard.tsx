import React from 'react';
import { Star, Award } from 'lucide-react';

export interface BarberItem {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialty: string;
  imageUrl: string;
}

interface BarberCardProps {
  barber: BarberItem;
}

export const BarberCard: React.FC<BarberCardProps> = ({ barber }) => {
  return (
    <div className="group bg-dark-card border border-dark-border hover:border-zinc-500 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-black/70">
      {/* ẢNH CHÂN DUNG DẠNG ĐỨNG */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        <img
          src={barber.imageUrl}
          alt={barber.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-black/30 to-transparent opacity-90" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-zinc-700/60 text-xs font-semibold text-zinc-200">
          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span>{barber.rating.toFixed(1)}</span>
          <span className="text-[10px] text-zinc-500">({barber.reviewCount})</span>
        </div>

        {/* Kinh nghiệm */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-[11px] font-medium text-zinc-300">
          <Award className="w-3 h-3 text-zinc-400" />
          <span>{barber.experienceYears} năm kinh nghiệm</span>
        </div>
      </div>

      {/* THÔNG TIN THỢ TÓC */}
      <div className="p-5 flex-1 flex flex-col justify-between text-center bg-dark-card">
        <div>
          <h3 className="text-lg font-black text-white tracking-wide uppercase group-hover:text-zinc-100 transition-colors">
            {barber.name}
          </h3>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1">
            {barber.title}
          </p>
          <div className="mt-3 inline-block px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-[11px] text-zinc-300">
            Sở trường: <span className="font-semibold text-white">{barber.specialty}</span>
          </div>
        </div>

        {/* NÚT THAO TÁC (HOVER MÀU CAM & NẢY LÊN) */}
        <div className="mt-5 pt-3 border-t border-zinc-800">
          <a
            href="#booking"
            className="w-full inline-block py-2.5 px-4 rounded-md text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange transition-all duration-200 uppercase tracking-wider transform hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 active:scale-95"
          >
            Xem lịch thợ
          </a>
        </div>
      </div>
    </div>
  );
};
