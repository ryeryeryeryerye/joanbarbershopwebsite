import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { ServiceCard, ServiceItem } from '@/features/services/components/ServiceCard';
import { BarberCard, BarberItem } from '@/features/barbers/components/BarberCard';
import logoImg from '@/assets/images/logo.jpg';

// 1. DỮ LIỆU SLIDE QUẢNG BÁ (HERO BANNER)
const HERO_SLIDES = [
  {
    id: 1,
    title: 'KỸ THUẬT CẮT FADE & TẠO FORM ĐỈNH CAO',
    tag: 'NGHỆ THUẬT KÉO VÀ LƯỠI DAO',
    description:
      'Tỉ mỉ từng milimet với tay nghề thợ giàu kinh nghiệm, mang lại vẻ ngoài lịch lãm và chuẩn form phong cách quý ông.',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'KHÔNG GIAN THƯ GIÃN CHUẨN GENTLEMAN',
    tag: 'TRẢI NGHIỆM ĐẲNG CẤP',
    description:
      'Tận hưởng tách cà phê đậm vị, thư thái trong tiếng nhạc jazz và thả lỏng với liệu trình gội dưỡng sinh khăn nóng.',
    imageUrl:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'ĐỊNH HÌNH PHONG CÁCH TÓC NAM HIỆN ĐẠI',
    tag: 'XU HƯỚNG TÓC THỜI THƯỢNG',
    description:
      'Tư vấn kiểu tóc chuẩn tỉ lệ khuôn mặt từ Pompadour cổ điển, Side Part sang trọng tới Textured Quiff trẻ trung.',
    imageUrl:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
  },
];

// 2. DỮ LIỆU 6 DỊCH VỤ NỔI BẬT (ĐỒNG BỘ NỘI DUNG TỪ SERVICE STEP)
const FEATURED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Combo Cắt Tóc 10 Bước',
    category: 'combo',
    categoryName: 'Combo 10 bước',
    price: 180000,
    durationMinutes: 45,
    description:
      'Combo cắt tóc siêu cấp với dịch vụ vô cùng tận tâm từ các barber có tay nghề cao.',
    imageUrl:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-2',
    name: 'Cắt Tóc cơ bản',
    category: 'haircut',
    categoryName: 'Cắt tóc cơ bản',
    price: 120000,
    durationMinutes: 35,
    description:
      'Dịch vụ cắt tóc cơ bản nhưng tận tâm trong cả quy trình.',
    imageUrl:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-3',
    name: 'Uốn tạo kiểu & Xử lý tóc',
    category: 'perm',
    categoryName: 'Uốn tạo kiểu',
    price: 350000,
    durationMinutes: 60,
    description:
      'Uốn tạo kiểu và xử lý tóc với tay nghề cao.',
    imageUrl:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-4',
    name: 'Nhuộm Màu Thời Thượng',
    category: 'color',
    categoryName: 'Nhuộm màu',
    price: 290000,
    durationMinutes: 50,
    description:
      'Sử dụng các dòng thuốc nhuộm cao cấp không xót rát',
    imageUrl:
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-5',
    name: 'Cạo Mặt & Lột Mụn',
    category: 'shave',
    categoryName: 'Cạo mặt & Lột mụn',
    price: 90000,
    durationMinutes: 25,
    description:
      'Cạo râu, lông mặt truyền thống với bọt mềm, đắp khăn nóng, lột mụn',
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-6',
    name: 'Chăm sóc tóc & Gội đầu Dưỡng Sinh',
    category: 'spa',
    categoryName: 'Gội dưỡng sinh',
    price: 100000,
    durationMinutes: 30,
    description:
      'Thư giãn với quy trình chăm sóc tóc chuyên nghiệp.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  },
];

// 3. DỮ LIỆU ĐỘI NGŨ THỢ TÓC (CAROUSEL)
const BARBERS_LIST: BarberItem[] = [
  {
    id: 'barber-1',
    name: 'Alex Trần',
    title: 'Master Barber / Founder',
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 186,
    specialty: 'Skin Fade & Classic Pompadour',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barber-2',
    name: 'Hoàng Barber',
    title: 'Senior Stylist',
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 142,
    specialty: 'Modern Crop & Taper Fade',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barber-3',
    name: 'David Nguyễn',
    title: 'Creative Director',
    experienceYears: 8,
    rating: 5.0,
    reviewCount: 165,
    specialty: 'Uốn Phồng & Nhuộm Thời Trang',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barber-4',
    name: 'Minh Quân',
    title: 'Senior Barber',
    experienceYears: 6,
    rating: 4.9,
    reviewCount: 128,
    specialty: 'Side Part 7/3 & Cạo Khăn Nóng',
    imageUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barber-5',
    name: 'Kenny Vũ',
    title: 'Lead Barber',
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 98,
    specialty: 'Mullet Nam Tính & Textured Quiff',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
  },
];

export const HomePage: React.FC = () => {
  // Slide Hero state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Carousel Thợ tóc state (chỉ số phần tử bắt đầu hiển thị 3 thẻ)
  const [barberStartIndex, setBarberStartIndex] = useState(0);

  // Tự động chuyển slide Hero mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Điều hướng Carousel Thợ tóc
  const handlePrevBarber = () => {
    setBarberStartIndex((prev) => (prev === 0 ? BARBERS_LIST.length - 1 : prev - 1));
  };

  const handleNextBarber = () => {
    setBarberStartIndex((prev) => (prev + 1) % BARBERS_LIST.length);
  };

  // Tính toán 3 thợ tóc hiển thị xoay vòng mượt mà
  const getVisibleBarbers = () => {
    const total = BARBERS_LIST.length;
    return [
      BARBERS_LIST[barberStartIndex % total],
      BARBERS_LIST[(barberStartIndex + 1) % total],
      BARBERS_LIST[(barberStartIndex + 2) % total],
    ];
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER (DỰA SÁT WIREFRAME)                                       */}
      {/* Trái: WELCOME TEXT + 2 nút (DỊCH VỤ, ĐẶT LỊCH CẮT TÓC)                   */}
      {/* Phải: SLIDE ẢNH QUẢNG BÁ                                                 */}
      {/* ========================================================================= */}
      <section className="pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* CỘT TRÁI: WELCOME TEXT & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* WELCOME TEXT (Đã bỏ nhãn badge theo yêu cầu) */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
                NÂNG TẦM <br />
                <span className="text-zinc-400">PHONG CÁCH</span> <br />
                BẢN LĨNH PHÁI MẠNH
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                Chào mừng quý khách đến với không gian cắt tóc và chăm sóc diện mạo chuẩn mực. Mỗi đường kéo là một tác phẩm nghệ thuật định hình khí chất và phong độ quý ông.
              </p>
            </div>

            {/* HAI NÚT BẤM (HOVER MÀU CAM & HIỆU ỨNG NẢY LÊN) */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Nút 1: DỊCH VỤ (Hover đổi cam và nảy nhẹ) */}
              <a href="#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-zinc-700 hover:border-cta-orange text-zinc-200 hover:text-white bg-zinc-900/80"
                >
                  DỊCH VỤ
                </Button>
              </a>

              {/* Nút 2: ĐẶT LỊCH CẮT TÓC (MÀU CAM ĐIỂM NHẤN + HIỆU ỨNG NẢY) */}
              <Link to="/booking">
                <Button
                  variant="cta"
                  size="lg"
                  className="gap-2 shadow-lg shadow-orange-950/40"
                >
                  <span>ĐẶT LỊCH CẮT TÓC</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Điểm nhấn tin cậy tối giản */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-lg sm:text-xl font-black text-white">10.000+</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Khách hàng tin chọn</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white">100%</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Thợ chuẩn chứng chỉ</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white">4.9 / 5.0</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Đánh giá hài lòng</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: SLIDE ẢNH QUẢNG BÁ (Đã bỏ tag text SLIDE ẢNH QUẢNG BÁ # theo yêu cầu) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black aspect-[4/3] sm:aspect-[16/11] group">
              {/* Ảnh slide hiện tại */}
              <img
                src={HERO_SLIDES[currentHeroSlide].imageUrl}
                alt={HERO_SLIDES[currentHeroSlide].title}
                className="w-full h-full object-cover object-center transition-all duration-700 transform group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Chú thích slide góc dưới */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block">
                  {HERO_SLIDES[currentHeroSlide].tag}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  {HERO_SLIDES[currentHeroSlide].title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {HERO_SLIDES[currentHeroSlide].description}
                </p>
              </div>

              {/* Điều hướng slide (Prev / Next: HOVER MÀU CAM & NẢY LÊN) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentHeroSlide((prev) =>
                      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-black/75 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
                  }
                  className="w-8 h-8 rounded-full bg-black/75 hover:bg-cta-orange border border-zinc-700 hover:border-cta-orange text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Indicator dots */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {HERO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentHeroSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentHeroSlide ? 'w-6 bg-orange-500' : 'w-2 bg-zinc-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. KHU VỰC DỊCH VỤ NỔI BẬT (DỊCH VỤ HOT - 6 THẺ DẠNG LƯỚI)                */}
      {/* Header dạng badge/box như wireframe: [ DỊCH VỤ HOT ]                      */}
      {/* ========================================================================= */}
      <section id="services" className="space-y-8 scroll-mt-28">
        {/* Tiêu đề khung theo sát wireframe */}
        <div className="border-b border-zinc-800 pb-5">
          <div className="space-y-2">
            {/* Box nhãn DỊCH VỤ HOT */}
            <div className="inline-block px-4 py-1.5 rounded-md border border-zinc-700 bg-zinc-900/90 text-white font-black text-sm tracking-[0.2em] uppercase">
              DỊCH VỤ HOT
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Tuyển tập 6 dịch vụ chăm sóc tóc và da mặt được khách hàng yêu thích và lựa chọn nhiều nhất.
            </p>
          </div>
        </div>

        {/* LƯỚI 6 THẺ DỊCH VỤ (3 CỘT X 2 HÀNG TRÊN DESKTOP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KHU VỰC THỢ TÓC (CAROUSEL 3 THẺ ĐỨNG KÈM MŨI TÊN ĐIỀU HƯỚNG)           */}
      {/* Header dạng badge/box: [ THỢ TÓC ]                                        */}
      {/* Hai bên có nút mũi tên [←] và [→] điều hướng 3 thẻ                       */}
      {/* ========================================================================= */}
      <section id="barbers" className="space-y-8 scroll-mt-28">
        {/* Tiêu đề khung theo sát wireframe */}
        <div className="border-b border-zinc-800 pb-5">
          <div className="space-y-2">
            {/* Box nhãn THỢ TÓC */}
            <div className="inline-block px-4 py-1.5 rounded-md border border-zinc-700 bg-zinc-900/90 text-white font-black text-sm tracking-[0.2em] uppercase">
              THỢ TÓC
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Đội ngũ nghệ nhân kéo điêu luyện với nhiều năm kinh nghiệm, luôn tận tâm tạo nên phong cách hoàn hảo.
            </p>
          </div>
        </div>

        {/* KHU VỰC CAROUSEL VỚI 3 THẺ ĐỨNG THEO SÁT WIREFRAME */}
        <div className="relative">
          {/* Nút mũi tên TRÁI [←] lớn bên ngoài theo wireframe (HOVER MÀU CAM & NẢY LÊN) */}
          <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handlePrevBarber}
              className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-950/95 hover:bg-cta-orange hover:border-cta-orange text-white flex items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
              aria-label="Previous barber slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* 3 THẺ CAROUSEL ĐƯỢC HIỂN THỊ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-4">
            {getVisibleBarbers().map((barber, index) => (
              <div
                key={`${barber.id}-${index}`}
                className="transition-all duration-500 transform animate-fadeIn"
              >
                <BarberCard barber={barber} />
              </div>
            ))}
          </div>

          {/* Nút mũi tên PHẢI [→] lớn bên ngoài theo wireframe (HOVER MÀU CAM & NẢY LÊN) */}
          <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleNextBarber}
              className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-950/95 hover:bg-cta-orange hover:border-cta-orange text-white flex items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
              aria-label="Next barber slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel indicators dots */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {BARBERS_LIST.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBarberStartIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === barberStartIndex % BARBERS_LIST.length
                  ? 'w-8 bg-orange-500'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
              aria-label={`Go to barber slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CALL TO ACTION CUỐI TRANG - ĐẶT LỊCH NGAY (ĐIỂM NHẤN CAM)             */}
      {/* ========================================================================= */}
      <section
        id="booking"
        className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-gradient-to-b from-zinc-900 to-black p-8 sm:p-14 text-center space-y-6 shadow-2xl"
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-zinc-700 shadow-md mb-2 bg-black flex items-center justify-center p-1">
            <img src={logoImg} alt="JOAN BARBERSHOP" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            SẴN SÀNG CHO DIỆN MẠO MỚI?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Chọn ngay dịch vụ yêu thích và người thợ bạn tin tưởng. Đặt lịch chỉ trong 60 giây, không phải chờ đợi tại tiệm.
          </p>
        </div>

        {/* NÚT ĐẶT LỊCH NGAY (HOVER MÀU CAM & NẢY LÊN) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/booking" className="w-full sm:w-auto">
            <Button
              variant="cta"
              size="lg"
              className="w-full sm:w-auto px-10 gap-2 shadow-xl shadow-orange-950/50"
            >
              <span>ĐẶT LỊCH NGAY BÂY GIỜ</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#services" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-white"
            >
              XEM LẠI DỊCH VỤ
            </Button>
          </a>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Miễn phí hủy trước 1 giờ
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Xác nhận tức thì qua tin nhắn
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Phục vụ đúng giờ đã đặt
          </span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
