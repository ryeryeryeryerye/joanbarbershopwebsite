export interface ServiceData {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  durationMinutes: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
  steps: string[];
}

export const CANONICAL_SERVICES: ServiceData[] = [
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
    popular: true,
    steps: [
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
    ],
  },
  {
    id: 'srv-2',
    name: 'Cắt Tóc cơ bản',
    category: 'haircut',
    categoryName: 'Cắt tóc cơ bản',
    price: 120000,
    durationMinutes: 35,
    description: 'Dịch vụ cắt tóc cơ bản nhưng tận tâm trong cả quy trình.',
    imageUrl:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    popular: true,
    steps: [
      'Khảo sát chất tóc và tư vấn kiểu tóc mong muốn',
      'Cắt tạo kiểu tỉ mỉ với kỹ thuật kéo & tông đơ chuẩn xác',
      'Cạo viền tóc mai và sau gáy sắc sảo',
      'Xả sạch tóc con và sấy tạo kiểu cơ bản',
    ],
  },
  {
    id: 'srv-3',
    name: 'Uốn tạo kiểu & Xử lý tóc',
    category: 'perm',
    categoryName: 'Uốn tạo kiểu',
    price: 350000,
    durationMinutes: 60,
    description: 'Uốn tạo kiểu và xử lý tóc với tay nghề cao.',
    imageUrl:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Kiểm tra cấu trúc tóc và tư vấn kiểu uốn phù hợp',
      'Sử dụng thuốc uốn cao cấp giữ ẩm, không gây xơ rối',
      'Kỹ thuật vào trục cuốn tạo lọn sóng phồng bồng bềnh',
      'Định hình form tóc và xả dưỡng phục hồi',
      'Hướng dẫn kỹ thuật sấy vào nếp chỉ 2 phút tại nhà',
    ],
  },
  {
    id: 'srv-4',
    name: 'Nhuộm Màu Thời Thượng',
    category: 'color',
    categoryName: 'Nhuộm màu',
    price: 290000,
    durationMinutes: 50,
    description: 'Sử dụng các dòng thuốc nhuộm cao cấp không xót rát',
    imageUrl:
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Tư vấn dải màu nhuộm tôn da (nâu lạnh, xám khói, đen ánh xanh...)',
      'Sử dụng thuốc nhuộm organic cao cấp không xót rát da đầu',
      'Kỹ thuật nhuộm đều màu từ chân đến ngọn',
      'Gội khóa màu và ủ dưỡng bảo vệ sợi tóc bóng mượt',
    ],
  },
  {
    id: 'srv-5',
    name: 'Cạo Mặt & Lột Mụn',
    category: 'shave',
    categoryName: 'Cạo mặt & Lột mụn',
    price: 90000,
    durationMinutes: 25,
    description: 'Cạo râu, lông mặt truyền thống với bọt mềm, đắp khăn nóng, lột mụn',
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Thoa bọt cạo chuyên dụng làm mềm râu và da mặt',
      'Cạo râu, lông mặt bằng dao cạo truyền thống lưỡi mới 100%',
      'Đắp khăn nóng thảo dược giãn nở lỗ chân lông',
      'Lột sạch mụn cám và bã nhờn vùng chữ T',
      'Thoa toner nước hoa hồng se khít lỗ chân lông và dưỡng ẩm',
    ],
  },
  {
    id: 'srv-6',
    name: 'Chăm sóc tóc & Gội đầu Dưỡng Sinh',
    category: 'spa',
    categoryName: 'Gội dưỡng sinh',
    price: 100000,
    durationMinutes: 30,
    description: 'Thư giãn với quy trình chăm sóc tóc chuyên nghiệp.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Khai thông các huyệt đạo vùng đầu và cổ vai gáy',
      'Gội đầu 2 lần bằng dầu gội thảo mộc dưỡng sinh',
      'Massage bấm huyệt chuyên sâu giải tỏa mệt mỏi căng thẳng',
      'Ủ dưỡng chất phục hồi nang tóc và sấy tạo phom nhẹ nhàng',
    ],
  },
];

