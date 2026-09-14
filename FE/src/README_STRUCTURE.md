# Cấu trúc FE

Mục tiêu: tách rõ giao diện, logic và gọi API để khi cần tìm một chức năng có thể vào đúng thư mục.

```text
src/
├── api/            # Chỉ gọi Backend
├── hooks/          # State, useEffect và logic xử lý của trang
├── views/          # Chỉ chứa giao diện JSX
├── pages/          # Nối hook với view, ưu tiên thật ngắn
├── components/     # Thành phần dùng chung
├── styles/         # CSS tách theo khu vực
├── App.jsx         # Khai báo route
└── main.jsx        # Điểm khởi động FE và import CSS
```

## Trang chủ

- Giao diện: `views/HomeView.jsx`
- Trang nối route: `pages/HomePage.jsx`
- CSS: `styles/home.css`

## Đăng nhập

- Giao diện: `views/LoginView.jsx`
- Logic form/API: `hooks/useLogin.js`
- API: `api/authApi.js`
- Trang nối logic với giao diện: `pages/LoginPage.jsx`
- CSS: `styles/login.css`

## Đặt lịch bệnh nhân

- Giao diện: `views/BookingView.jsx`
- Logic đặt lịch, lịch trống, tra cứu và hủy lịch: `hooks/useBooking.js`
- API: `api/publicApi.js`
- Trang nối logic với giao diện: `pages/PublicPage.jsx`
- CSS: `styles/booking.css`

## Thành phần dùng chung

- Khung ứng dụng: `components/AppShell.jsx`
- Bảo vệ route: `components/ProtectedRoute.jsx`
- CSS dùng chung: `styles/global.css` và `styles/layout.css`

## Quy tắc viết code

- Dòng ngắn vừa màn hình thì giữ trên một dòng.
- Chỉ xuống dòng khi câu lệnh dài hoặc JSX khó đọc.
- Không đặt gọi API trực tiếp trong `views/`.
- Không đặt giao diện lớn trong `hooks/`.
- `pages/` chỉ nên nối logic và giao diện khi có thể.
