import React, { useState, useEffect } from 'react';
import { Clock, Check, Scissors, X } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { BookingStepData } from '../types/bookingTypes';
import { axiosClient } from '@/lib';
import { CANONICAL_SERVICES, ServiceData } from '@/features/services';

interface ServiceStepProps {
  selectedServiceId?: string;
  onSelect: (service: Partial<BookingStepData>) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({ selectedServiceId, onSelect }) => {
  const [services, setServices] = useState<ServiceData[]>(CANONICAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [detailModalService, setDetailModalService] = useState<ServiceData | null>(null);

  // Lấy dữ liệu dịch vụ từ API backend (MongoDB), đồng bộ với DB
  useEffect(() => {
    let mounted = true;
    axiosClient
      .get('/services')
      .then((res: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (res as any)?.data || res;
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: ServiceData[] = CANONICAL_SERVICES.map((canon) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fromDb = data.find((d: any) => d.name?.toLowerCase() === canon.name.toLowerCase());
            return {
              ...canon,
              id: fromDb?._id || canon.id,
              price: fromDb?.price ?? canon.price,
              durationMinutes: fromDb?.durationMinutes ?? canon.durationMinutes,
              description: fromDb?.description || canon.description,
            };
          });
          setServices(mapped);
        }
      })
      .catch(() => {
        // Giữ CANONICAL_SERVICES
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = [
    { id: 'all', label: 'Tất cả dịch vụ' },
    { id: 'combo', label: 'Combo 10 bước' },
    { id: 'haircut', label: 'Cắt tóc cơ bản' },
    { id: 'perm', label: 'Uốn tạo kiểu' },
    { id: 'color', label: 'Nhuộm màu' },
    { id: 'shave', label: 'Cạo mặt & Lột mụn' },
    { id: 'spa', label: 'Gội dưỡng sinh' },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Scissors className="w-5 h-5 text-orange-400" />
          <span>Bước 1: Chọn Dịch Vụ Cắt Tóc & Chăm Sóc</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Tuyển tập 6 dịch vụ chăm sóc tóc và da mặt được khách hàng yêu thích và lựa chọn nhiều nhất.
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

      {/* DANH SÁCH THẺ DỊCH VỤ - ĐỒNG BỘ 100% VỚI CARD Ở TRANG CHỦ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map((service) => {
          const isSelected = selectedServiceId === service.id || selectedServiceId === service.name;
          return (
            <div
              key={service.id}
              className={`group bg-dark-card border rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-black/60 relative ${
                isSelected
                  ? 'border-cta-orange ring-2 ring-orange-500 shadow-orange-950/40 bg-zinc-900/90'
                  : 'border-dark-border hover:border-zinc-500'
              }`}
            >
              {/* ẢNH DỊCH VỤ DẠNG BANNER PHÍA TRÊN */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />

                {/* Nhãn phân loại dịch vụ góc trên bên trái */}
                {service.categoryName && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-zinc-700/80 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    {service.categoryName}
                  </div>
                )}

                {/* Check icon khi được chọn */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-cta-orange text-white flex items-center justify-center shadow-lg ring-2 ring-white/30">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Thời lượng góc dưới bên trái */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-zinc-700/60 text-[11px] font-medium text-zinc-300">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>{service.durationMinutes} phút</span>
                </div>
              </div>

              {/* THÔNG TIN DỊCH VỤ */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* GIÁ TIỀN & THAO TÁC: HAI NÚT CHI TIẾT & CHỌN GÓI */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                      Giá dịch vụ
                    </span>
                    <span className="text-base font-extrabold text-white tracking-tight">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút xem chi tiết các bước */}
                    <button
                      type="button"
                      onClick={() => setDetailModalService(service)}
                      className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                    >
                      Chi tiết
                    </button>

                    {/* Nút chọn gói */}
                    <button
                      type="button"
                      onClick={() =>
                        onSelect({
                          serviceId: service.id,
                          serviceName: service.name,
                          servicePrice: service.price,
                          serviceDuration: service.durationMinutes,
                          serviceImage: service.imageUrl,
                        })
                      }
                      className={`text-xs font-bold px-3.5 py-1.5 rounded transition-all duration-200 uppercase tracking-wider transform hover:-translate-y-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-cta-orange text-white shadow-lg shadow-orange-950/50'
                          : 'bg-zinc-800 hover:bg-cta-orange text-zinc-200 hover:text-white border border-zinc-700 hover:border-cta-orange'
                      }`}
                    >
                      {isSelected ? 'ĐÃ CHỌN' : 'ĐẶT LỊCH'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CHI TIẾT DỊCH VỤ */}
      {detailModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 flex-shrink-0">
              <img
                src={detailModalService.imageUrl}
                alt={detailModalService.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />
              <button
                type="button"
                onClick={() => setDetailModalService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-cta-orange transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded bg-cta-orange text-white font-bold text-xs uppercase tracking-wider">
                  {detailModalService.categoryName || 'Dịch vụ'}
                </span>
                <h3 className="text-xl font-black text-white mt-2 leading-tight">
                  {detailModalService.name}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-300 text-sm">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Thời gian: <strong>{detailModalService.durationMinutes} phút</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white">
                    {formatCurrency(detailModalService.price)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Mô tả dịch vụ
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {detailModalService.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-cta-orange" />
                  <span>Quy trình thực hiện ({detailModalService.steps?.length || 0} bước)</span>
                </h4>
                <div className="space-y-2.5">
                  {detailModalService.steps?.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                      <div className="w-5 h-5 rounded-full bg-orange-950/60 border border-orange-800 text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDetailModalService(null)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    serviceId: detailModalService.id,
                    serviceName: detailModalService.name,
                    servicePrice: detailModalService.price,
                    serviceDuration: detailModalService.durationMinutes,
                    serviceImage: detailModalService.imageUrl,
                  });
                  setDetailModalService(null);
                }}
                className="px-6 py-2 text-xs font-bold uppercase rounded-lg bg-cta-orange hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-950/40"
              >
                Chọn dịch vụ này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
