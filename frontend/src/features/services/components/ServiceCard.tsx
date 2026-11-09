import React from 'react';
import { Clock } from 'lucide-react';
import { formatCurrency } from '@/utils';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  imageUrl: string;
  category?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-dark-card border border-dark-border hover:border-zinc-500 rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-black/60">
      {/* ẢNH DỊCH VỤ */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />
        
        {/* Thời lượng */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-zinc-700/60 text-[11px] font-medium text-zinc-300">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{service.durationMinutes} phút</span>
        </div>
      </div>

      {/* THÔNG TIN DỊCH VỤ */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-100 transition-colors tracking-tight line-clamp-1">
            {service.name}
          </h3>
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* GIÁ TIỀN & THAO TÁC (NÚT HOVER MÀU CAM & NẢY LÊN) */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Giá dịch vụ</span>
            <span className="text-base font-extrabold text-white tracking-tight">
              {formatCurrency(service.price)}
            </span>
          </div>
          <a
            href="#booking"
            className="text-xs font-semibold text-zinc-200 hover:text-white px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange transition-all duration-200 uppercase tracking-wider transform hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 active:scale-95 inline-block"
          >
            Chi tiết
          </a>
        </div>
      </div>
    </div>
  );
};
