# BARBERSHOP – Website Quản Lý Và Đặt Lịch Cắt Tóc Trực Tuyến

Dự án đồ án tốt nghiệp / thực tập xây dựng hệ thống website quản lý và đặt lịch cắt tóc trực tuyến chuyên nghiệp.

## 1. Kiến trúc Monorepo

```text
internproject/
├── frontend/     # ReactJS + TypeScript + Vite + Tailwind CSS
├── backend/      # Node.js + ExpressJS + TypeScript + MongoDB
├── docs/         # Tài liệu thiết kế, đặc tả, báo cáo dự án
├── package.json  # Root package.json quản lý workspace
├── .gitignore
├── .env.example
└── README.md
```

## 2. Tech Stack

### Frontend
- **Framework & Tooling:** ReactJS (v18+), TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide React (icons)
- **Routing:** React Router v6
- **Server State:** TanStack Query (React Query v5)
- **HTTP Client:** Axios
- **Code Quality:** ESLint, Prettier

### Backend
- **Platform & Framework:** Node.js, ExpressJS, TypeScript
- **Database:** MongoDB, Mongoose ODM
- **Authentication & Security:** JWT (JSON Web Tokens), bcryptjs, CORS
- **Execution & Tooling:** tsx / nodemon, ESLint, Prettier

## 3. Cấu trúc thư mục chi tiết

### Frontend (`frontend/src/`)
- `app/`: Setup App component, Provider stack (QueryClientProvider, AuthProvider,...), Router configurations.
- `assets/`: Hình ảnh, icons, static assets tĩnh.
- `components/ui/`: Các UI components nguyên tử (Button, Input, Modal, Badge,...).
- `components/shared/`: Các component dùng chung giữa các trang (Navbar, Footer, Sidebar, Layout,...).
- `features/`: Kiến trúc Feature-based, mỗi feature bao gồm `api`, `components`, `hooks`, `types`:
  - `auth/`: Đăng ký, đăng nhập, quên mật khẩu, phân quyền.
  - `booking/`: Luồng đặt lịch cắt tóc trực tuyến.
  - `appointments/`: Quản lý danh sách lịch hẹn của khách hàng / thợ.
  - `services/`: Quản lý và hiển thị danh sách dịch vụ làm tóc.
  - `barbers/`: Danh sách thông tin thợ cắt tóc, tay nghề, đánh giá.
  - `profile/`: Thông tin cá nhân, cập nhật tài khoản.
  - `admin/`: Bảng điều khiển quản trị viên (dashboard, thống kê, quản lý người dùng/lịch hẹn).
- `hooks/`: Custom hooks dùng chung toàn dự án (useDebounce, useMediaQuery,...).
- `lib/`: Khởi tạo và cấu hình thư viện bên thứ 3 (axiosClient, queryClient).
- `types/`: Global Types, API response structures, Common interfaces.
- `utils/`: Hàm tiện ích hỗ trợ format tiền tệ, ngày giờ, classnames (cn).

### Backend (`backend/src/`)
- `config/`: Kết nối Database, nạp cấu hình biến môi trường.
- `models/`: Mongoose Schemas & Models (User, Appointment, Service, Barber, Review,...).
- `controllers/`: Tiếp nhận request, xử lý luồng, gọi service và trả về response.
- `routes/`: Định nghĩa API endpoints và gắn middleware.
- `middlewares/`: Kiểm tra Authentication (JWT), Authorization (Role-based), validate request, error handling.
- `services/`: Chứa toàn bộ business logic độc lập.
- `validators/`: Schema validation cho request body/params/query.
- `utils/`: Hàm trợ giúp (ApiResponse, ApiError, logger, helpers).
- `seed/`: Script khởi tạo dữ liệu mẫu ban đầu (admin account, sample services, barbers).

## 4. Hướng dẫn cài đặt và khởi chạy

### Cài đặt Dependencies
```bash
# Cài đặt toàn bộ dependencies cho cả frontend và backend
npm install
```

### Chạy môi trường Development
```bash
# Chạy đồng thời hoặc từng phần:
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:5000
```

