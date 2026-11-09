import React, { useState } from 'react';
import { Clock, Check, Scissors } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { BookingStepData } from '../types/bookingTypes';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
}

const AVAILABLE_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Combo Cắt Tóc Đế Vương 10 Bước',
    category: 'combo',
    price: 180000,
    durationMinutes: 45,
    description: 'Tư vấn dáng tóc, gội thư giãn, cắt tạo kiểu, cạo viền khăn nóng, vuốt sáp Pomade tạo form.',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Cắt Tóc & Tạo Kiểu Pompadour Classic',
    category: 'haircut',
    price: 120000,
    durationMinutes: 35,
    description: 'Kỹ thuật Fade sắc sảo, định hình phom tóc cổ điển quý ông sang trọng.',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Uốn Phồng Textured Quiff / Side Part',
    category: 'perm',
    price: 350000,
    durationMinutes: 60,
    description: 'Uốn phồng tự nhiên công nghệ Hàn Quốc, bồng bềnh và giữ form bền đẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-4',
    name: 'Nhuộm Màu Thời Thượng Gentleman',
    category: 'color',
    price: 290000,
    durationMinutes: 50,
    description: 'Dòng thuốc nhuộm cao cấp không xót rát, tone màu nâu lạnh, xám khói nam tính.',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-5',
    name: 'Cạo Mặt & Đắp Khăn Nóng Thảo Dược',
    category: 'spa',
    price: 90000,
    durationMinutes: 25,
    description: 'Cạo râu truyền thống với bọt mềm, đắp khăn nóng thảo dược xua tan mệt mỏi.',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-6',
    name: 'Tẩy Tế Bào Chết & Gội Dưỡng Sinh',
    category: 'spa',
    price: 100000,
    durationMinutes: 30,
    description: 'Làm sạch sâu bã nhờn chân tóc, bấm huyệt lưu thông tuần hoàn máu vùng đầu.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  },
];

interface ServiceStepProps {
  selectedServiceId?: string;
  onSelect: (service: Partial<BookingStepData>) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({ selectedServiceId, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả dịch vụ' },
    { id: 'combo', label: 'Combo Đế Vương' },
    { id: 'haircut', label: 'Cắt & Tạo kiểu' },
    { id: 'perm', label: 'Uốn tóc' },
    { id: 'color', label: 'Nhuộm màu' },
    { id: 'spa', label: 'Gội & Chăm sóc' },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? AVAILABLE_SERVICES
      : AVAILABLE_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Scissors className="w-5 h-5 text-orange-400" />
          <span>Bước 1: Chọn Dịch Vụ Cắt Tóc & Chăm Sóc</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Lựa chọn gói dịch vụ bạn mong muốn trải nghiệm tại Gentlemen Barbershop.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 ${
              activeCategory === cat.id
                ? 'bg-cta-orange text-white shadow-md shadow-orange-950/40'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* DANH SÁCH THẺ DỊCH VỤ DẠNG LƯỚI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() =>
                onSelect({
                  serviceId: service.id,
                  serviceName: service.name,
                  servicePrice: service.price,
                  serviceDuration: service.durationMinutes,
                  serviceImage: service.imageUrl,
                })
              }
              className={`group relative rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 ${
                isSelected
                  ? 'bg-zinc-900 border-cta-orange shadow-lg shadow-orange-950/30 ring-1 ring-orange-500'
                  : 'bg-dark-card border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/90'
              }`}
            >
              {/* Checkmark icon khi được chọn */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cta-orange text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {service.popular && !isSelected && (
                <span className="absolute top-3 right-3 text-[10px] font-bold text-orange-400 bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded uppercase tracking-wider">
                  HOT
                </span>
              )}

              <div className="flex gap-4">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-zinc-800 border border-zinc-700/80"
                />
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {service.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-500">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{service.durationMinutes} phút</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">
                  {formatCurrency(service.price)}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                    isSelected
                      ? 'bg-cta-orange text-white'
                      : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                  }`}
                >
                  {isSelected ? 'ĐÃ CHỌN' : 'CHỌN GÓI NÀY'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

