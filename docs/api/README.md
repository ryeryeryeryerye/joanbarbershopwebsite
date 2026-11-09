# 6. Đặc Tả Giao Diện Lập Trình Ứng Dụng (API Specification)

- Chuẩn RESTful API v1 (`/api/v1/...`).
- Format trao đổi dữ liệu: `application/json`.
- Định dạng phản hồi chuẩn:
```json
{
  "success": true,
  "message": "Thông báo kết quả",
  "data": {}
}
```
Mã lỗi: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.

