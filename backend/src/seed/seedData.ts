import bcrypt from 'bcryptjs';
import { UserModel, ServiceModel, BarberModel } from '../models';
import { logger } from '../utils/logger';

export const runSeed = async (): Promise<void> => {
  logger.info('Bắt đầu khởi tạo dữ liệu mẫu cho database JOAN BARBERSHOP...');

  // 1. Tạo tài khoản Admin mặc định
  const existingAdmin = await UserModel.findOne({ email: 'admin@joanbarber.vn' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await UserModel.create({
      name: 'Admin Quản Trị',
      email: 'admin@joanbarber.vn',
      password: hashedPassword,
      phone: '0988123456',
      role: 'admin',
    });
    logger.info(' Đã tạo tài khoản Admin: admin@joanbarber.vn / admin123');
  } else {
    logger.info(' Tài khoản Admin đã tồn tại.');
  }

  // 2. Tạo 6 Dịch vụ mẫu
  const serviceCount = await ServiceModel.countDocuments();
  if (serviceCount === 0) {
    await ServiceModel.insertMany([
      {
        name: 'Combo Cắt Tóc 10 Bước',
        description: 'Combo cắt tóc siêu cấp với dịch vụ vô cùng tận tâm từ các barber có tay nghề cao.',
        durationMinutes: 45,
        price: 180000,
        imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        name: 'Cắt Tóc cơ bản',
        description: 'Dịch vụ cắt tóc cơ bản nhưng tận tâm trong cả quy trình.',
        durationMinutes: 35,
        price: 120000,
        imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        name: 'Uốn tạo kiểu & Xử lý tóc',
        description: 'Uốn tạo kiểu và xử lý tóc với tay nghề cao.',
        durationMinutes: 60,
        price: 350000,
        imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        name: 'Nhuộm Màu Thời Thượng',
        description: 'Sử dụng các dòng thuốc nhuộm cao cấp không xót rát',
        durationMinutes: 50,
        price: 290000,
        imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        name: 'Cạo Mặt & Lột Mụn',
        description: 'Cạo râu, lông mặt truyền thống với bọt mềm, đắp khăn nóng, lột mụn',
        durationMinutes: 25,
        price: 90000,
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        name: 'Chăm sóc tóc & Gội đầu Dưỡng Sinh',
        description: 'Thư giãn với quy trình chăm sóc tóc chuyên nghiệp.',
        durationMinutes: 30,
        price: 100000,
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
    ]);
    logger.info(' Đã khởi tạo 6 Dịch vụ cắt tóc mẫu.');
  }

  // 3. Tạo 5 Thợ cắt tóc mẫu
  const barberCount = await BarberModel.countDocuments();
  if (barberCount === 0) {
    await BarberModel.insertMany([
      {
        name: 'Alex Trần',
        title: 'Master Barber / Founder',
        experienceYears: 10,
        rating: 5.0,
        reviewCount: 186,
        specialty: 'Skin Fade & Classic Pompadour',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
        isActive: true,
      },
      {
        name: 'Hoàng Barber',
        title: 'Senior Stylist',
        experienceYears: 7,
        rating: 4.9,
        reviewCount: 142,
        specialty: 'Modern Crop & Taper Fade',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
        isActive: true,
      },
      {
        name: 'David Nguyễn',
        title: 'Creative Director',
        experienceYears: 8,
        rating: 5.0,
        reviewCount: 165,
        specialty: 'Uốn Phồng & Nhuộm Thời Trang',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
        isActive: true,
      },
      {
        name: 'Minh Quân',
        title: 'Senior Barber',
        experienceYears: 6,
        rating: 4.9,
        reviewCount: 128,
        specialty: 'Side Part 7/3 & Cạo Khăn Nóng',
        imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
        isActive: true,
      },
      {
        name: 'Kenny Vũ',
        title: 'Lead Barber',
        experienceYears: 5,
        rating: 4.8,
        reviewCount: 98,
        specialty: 'Mullet Nam Tính & Textured Quiff',
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
        isActive: true,
      },
    ]);
    logger.info(' Đã khởi tạo 5 Thợ cắt tóc mẫu.');
  }

  logger.info(' Hoàn tất seed dữ liệu cho Database joanbarbershop!');
};
