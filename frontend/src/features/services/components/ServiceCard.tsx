import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X, CheckCircle2, Scissors, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/utils';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  imageUrl: string;
  category?: string;
  categoryName?: string;
  steps?: string[];
}

interface ServiceCardProps {
  service: ServiceItem;
}

// Quy trình phục vụ mặc định cho từng dịch vụ nếu chưa có sẵn
const getDefaultServiceSteps = (serviceId: string, serviceName: string): string[] => {
  if (serviceId === 'srv-1' || serviceName.includes('10 Bước')) {
    return [
      'Tư vấn dáng tóc theo chất tóc và tỉ lệ khuôn mặt',
      'Gội đầu thảo dược làm sạch bã nhờn da đầu',
      'Cắt tỉa tạo kiểu Fade / Side Part chuẩn form quý ông',
      'Cạo viền sắc nét và cạo râu bọt êm ái',
      'Đắp khăn nóng thảo dược thư giãn vùng mặt',
      'Rửa mặt, hút mụn cám và làm sạch sâu da mặt',
      'Gội xả sạch tóc con sau khi cắt',
      'Sấy định hình tạo phom tóc tự nhiên',
      'Vuốt sáp Pomade cao cấp giữ nếp bền đẹp',
      'Xịt gôm khóa form và nước hoa nam tính',
    ];
  }
  if (serviceId === 'srv-2' || serviceName.includes('cơ bản')) {
    return [
      'Khảo sát chất tóc và tư vấn kiểu tóc mong muốn',
      'Cắt tạo kiểu tỉ mỉ với kỹ thuật kéo & tông đơ chuẩn xác',
      'Cạo viền tóc mai và sau gáy sắc sảo',
      'Xả sạch tóc con và sấy tạo kiểu cơ bản',
    ];
  }
  if (serviceId === 'srv-3' || serviceName.includes('Uốn')) {
    return [
      'Kiểm tra cấu trúc tóc và tư vấn kiểu uốn phù hợp',
      'Sử dụng thuốc uốn cao cấp giữ ẩm, không gây xơ rối',
      'Kỹ thuật vào trục cuốn tạo lọn sóng phồng bồng bềnh',
      'Định hình form tóc và xả dưỡng phục hồi',
      'Hướng dẫn kỹ thuật sấy vào nếp chỉ 2 phút tại nhà',
    ];
  }
  if (serviceId === 'srv-4' || serviceName.includes('Nhuộm')) {
    return [
      'Tư vấn dải màu nhuộm tôn da (nâu lạnh, xám khói, đen ánh xanh...)',
      'Sử dụng thuốc nhuộm organic cao cấp không xót rát da đầu',
      'Kỹ thuật nhuộm đều màu từ chân đến ngọn',
      'Gội khóa màu và ủ dưỡng bảo vệ sợi tóc bóng mượt',
    ];
  }
  if (serviceId === 'srv-5' || serviceName.includes('Cạo Mặt')) {
    return [
      'Thoa bọt cạo chuyên dụng làm mềm râu và da mặt',
      'Cạo râu, lông mặt bằng dao cạo truyền thống lưỡi mới 100%',
      'Đắp khăn nóng thảo dược giãn nở lỗ chân lông',
      'Lột sạch mụn cám và bã nhờn vùng chữ T',
      'Thoa toner nước hoa hồng se khít lỗ chân lông và dưỡng ẩm',
    ];
  }
  return [
    'Khai thông các huyệt đạo vùng đầu và cổ vai gáy',
    'Gội đầu 2 lần bằng dầu gội thảo mộc dưỡng sinh',
    'Massage bấm huyệt chuyên sâu giải tỏa mệt mỏi căng thẳng',
    'Ủ dưỡng chất phục hồi nang tóc và sấy tạo phom nhẹ nhàng',
  ];
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = service.steps || getDefaultServiceSteps(service.id, service.name);

  return (
    <>
      <div className="group bg-dark-card border border-dark-border hover:border-zinc-500 rounded overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-black/60">
        {/* ẢNH DỊCH VỤ - SẠCH SẼ HOÀN TOÀN, KHÔNG CÓ TEXT ĐÈ LÊN ẢNH */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* THÔNG TIN DỊCH VỤ */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-100 transition-colors tracking-tight line-clamp-1">
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

          {/* GIÁ TIỀN & THAO TÁC (HAI NÚT CÙNG MÀU: CHI TIẾT & ĐẶT LỊCH) */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Giá dịch vụ</span>
              <span className="text-base font-extrabold text-orange-400 tracking-tight">
                {formatCurrency(service.price)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* NÚT CHI TIẾT: MỞ MODAL XEM CHI TIẾT GÓI DỊCH VỤ */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-zinc-200 hover:text-white px-3 py-1.5 rounded bg-zinc-800 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange transition-all duration-200 uppercase tracking-wider transform hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
              >
                Chi tiết
              </button>

              {/* NÚT ĐẶT LỊCH: CÙNG MÀU VỚI NÚT CHI TIẾT */}
              <Link
                to={`/booking?serviceId=${service.id}`}
                className="text-xs font-semibold text-zinc-200 hover:text-white px-3 py-1.5 rounded bg-zinc-800 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange transition-all duration-200 uppercase tracking-wider transform hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/30 active:scale-95 inline-block"
              >
                Đặt lịch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT DỊCH VỤ (POPUP HÌNH CHỮ NHẬT CỐ ĐỊNH KÍCH THƯỚC ĐỒNG BỘ MỌI DỊCH VỤ) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[590px] max-h-[90vh] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* NÚT ĐÓNG X GÓC TRÊN BÊN PHẢI */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded bg-zinc-800/80 hover:bg-cta-orange text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* CỘT BÊN TRÁI: ẢNH DỊCH VỤ - SẠCH SẼ HOÀN TOÀN, KHÔNG CÓ TEXT */}
            <div className="relative w-full md:w-5/12 lg:w-1/2 bg-zinc-950 flex-shrink-0 min-h-[220px] md:h-full overflow-hidden">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* CỘT BÊN PHẢI: CHI TIẾT THÔNG TIN DỊCH VỤ */}
            <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-between p-6 sm:p-7 overflow-y-auto md:h-full space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {service.name}
                  </h3>
                </div>

                {/* Box 2 thông số: Thời gian phục vụ & Giá cả */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Thời lượng</span>
                      <span className="text-xs sm:text-sm font-bold text-orange-400">{service.durationMinutes} phút</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l border-zinc-800 pl-3">
                    <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                      <Scissors className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Giá trọn gói</span>
                      <span className="text-xs sm:text-sm font-extrabold text-orange-400">{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Chi tiết quy trình phục vụ - DÙNG LẠI THIẾT KẾ CŨ: DANH SÁCH DỌC */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>QUY TRÌNH CÁC BƯỚC PHỤC VỤ CHI TIẾT</span>
                  </h4>
                  <ul className="space-y-2">
                    {steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Modal: Nút Đặt lịch & Đóng */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold tracking-wider text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all uppercase cursor-pointer"
                >
                  ĐÓNG
                </button>
                <Link
                  to={`/booking?serviceId=${service.id}`}
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded text-xs font-bold tracking-wider text-white bg-cta-orange hover:bg-orange-600 shadow-md shadow-orange-950/40 hover:shadow-orange-500/30 transition-all uppercase transform hover:-translate-y-0.5"
                >
                  ĐẶT LỊCH GÓI NÀY
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
