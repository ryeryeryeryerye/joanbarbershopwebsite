# 1. Đặc Tả Yêu Cầu & Nghiệp Vụ (Requirements)

## 1.1 Tổng quan
Hệ thống **BARBERSHOP** giải quyết bài toán quản lý tiệm cắt tóc, giảm thời gian chờ đợi của khách hàng và tối ưu lịch làm việc của thợ cắt tóc.

## 1.2 Nhóm người dùng (Actor)
- **Guest / Customer (Khách hàng):** Xem dịch vụ, chọn thợ, đặt lịch hẹn trực tuyến, quản lý lịch hẹn cá nhân, đánh giá dịch vụ.
- **Barber (Thợ cắt tóc):** Quản lý ca làm việc, xem lịch hẹn được phân công, cập nhật trạng thái lịch hẹn (đang cắt, hoàn thành).
- **Admin (Quản trị viên):** Quản trị danh mục dịch vụ, nhân viên (thợ), người dùng, lịch hẹn toàn hệ thống, thống kê doanh thu và hoạt động.

## 1.3 Yêu cầu chức năng chính
- Xác thực & Phân quyền (Authentication & Authorization).
- Quản lý dịch vụ & bảng giá (Services Catalog).
- Quản lý danh sách thợ cắt tóc & khung giờ làm việc (Barbers & Time Slots).
- Đặt lịch hẹn cắt tóc trực tuyến (Booking flow đa bước).
- Quản lý lịch hẹn & trạng thái (Appointments Management).
- Hồ sơ người dùng (User Profile).
- Báo cáo thống kê quản trị (Admin Dashboard & Analytics).

