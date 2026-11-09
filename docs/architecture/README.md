# 5. Kiến Trúc Hệ Thống (Architecture)

## 5.1 Kiến trúc Monorepo & Feature-based
- **Frontend:** Feature-based modular pattern: Mỗi nghiệp vụ (auth, booking, appointments, services, barbers, profile, admin) được đóng gói độc lập gồm `api`, `components`, `hooks`, `types`.
- **Backend:** Phân tầng theo chuẩn N-tier:
  - `controllers`: Xử lý HTTP Request/Response.
  - `services`: Chứa Business Logic nghiệp vụ thuần túy.
  - `models`: Định nghĩa dữ liệu Mongoose Schema và Model.
  - `middlewares`: Xác thực JWT, phân quyền Role-based, validation, xử lý lỗi tập trung.
  - `routes`: Định tuyến API theo chuẩn REST.

