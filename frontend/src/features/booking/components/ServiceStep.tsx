import React, { useState, useEffect } from 'react';
import { Clock, Check, CheckCircle2, Scissors, X } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Scissors className="w-5 h-5 text-orange-400" />
          <span>Bước 1: Chọn Dịch Vụ Cắt Tóc & Chăm Sóc</span>
        </h2>
      </div>

      {/* DANH SÁCH THẺ DỊCH VỤ - CLICK CHỌN NHANH TRỰC TIẾP TRÊN THẺ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id || selectedServiceId === service.name;
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
              className={`group bg-dark-card border rounded overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-black/60 relative cursor-pointer ${
                isSelected
                  ? 'border-cta-orange ring-2 ring-orange-500 shadow-orange-950/40 bg-zinc-900/90'
                  : 'border-dark-border hover:border-zinc-500'
              }`}
            >
              {/* ẢNH DỊCH VỤ - SẠCH SẼ HOÀN TOÀN, KHÔNG CÓ TEXT ĐÈ LÊN ẢNH */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Check icon khi được chọn */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded bg-cta-orange text-white flex items-center justify-center shadow-lg ring-2 ring-white/30 z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* THÔNG TIN DỊCH VỤ - CÂN BẰNG ĐẨY NỘI DUNG LÊN TRÊN */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight line-clamp-1">
                      {service.name}
                    </h3>
                    <span className="flex items-center gap-1 text-zinc-400 text-[11px] flex-shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      <span className="text-orange-400 font-medium">{service.durationMinutes} phút</span>
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* GIÁ TIỀN & THAO TÁC: HAI NÚT CHI TIẾT & CHỌN GÓI */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                      Giá dịch vụ
                    </span>
                    <span className="text-base font-extrabold text-orange-400 tracking-tight">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút xem chi tiết các bước (ngăn sự kiện nổi bọt để không trigger chọn) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailModalService(service);
                      }}
                      className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 uppercase tracking-wider cursor-pointer"
                    >
                      Chi tiết
                    </button>

                    {/* Nút chọn gói */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect({
                          serviceId: service.id,
                          serviceName: service.name,
                          servicePrice: service.price,
                          serviceDuration: service.durationMinutes,
                          serviceImage: service.imageUrl,
                        });
                      }}
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

      {/* MODAL CHI TIẾT DỊCH VỤ (HÌNH CHỮ NHẬT: ẢNH BÊN TRÁI, THÔNG TIN BÊN PHẢI) */}
      {detailModalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn cursor-pointer"
          onClick={() => setDetailModalService(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[590px] max-h-[90vh] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng X */}
            <button
              type="button"
              onClick={() => setDetailModalService(null)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded bg-zinc-800/80 hover:bg-cta-orange text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* CỘT BÊN TRÁI: ẢNH DỊCH VỤ - SẠCH SẼ HOÀN TOÀN, KHÔNG CÓ TEXT */}
            <div className="relative w-full md:w-5/12 lg:w-1/2 bg-zinc-950 flex-shrink-0 min-h-[220px] md:h-full overflow-hidden">
              <img
                src={detailModalService.imageUrl}
                alt={detailModalService.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* CỘT BÊN PHẢI: CHI TIẾT THÔNG TIN DỊCH VỤ */}
            <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-between p-6 sm:p-7 overflow-y-auto md:h-full space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {detailModalService.name}
                  </h3>
                </div>

                {/* Box 2 thông số: Thời gian & Giá */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Thời lượng</span>
                      <span className="text-xs sm:text-sm font-bold text-orange-400">{detailModalService.durationMinutes} phút</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l border-zinc-800 pl-3">
                    <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                      <Scissors className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Giá trọn gói</span>
                      <span className="text-xs sm:text-sm font-extrabold text-orange-400">{formatCurrency(detailModalService.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Quy trình thực hiện các bước - DÙNG LẠI THIẾT KŨ: DANH SÁCH DỌC */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-white" />
                    <span>QUY TRÌNH CÁC BƯỚC PHỤC VỤ CHI TIẾT</span>
                  </h4>
                  <ul className="space-y-2">
                    {detailModalService.steps?.map((stepText, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{stepText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Modal: Nút Đóng & Chọn dịch vụ này */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDetailModalService(null)}
                  className="px-4 py-2 rounded text-xs font-semibold tracking-wider text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all uppercase cursor-pointer"
                >
                  ĐÓNG
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
                  className="px-6 py-2 rounded text-xs font-bold tracking-wider text-white bg-cta-orange hover:bg-orange-500 shadow-md shadow-orange-950/40 hover:shadow-orange-500/30 transition-all uppercase transform hover:-translate-y-0.5 cursor-pointer"
                >
                  CHỌN GÓI NÀY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
