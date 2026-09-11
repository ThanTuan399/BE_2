# Phòng khám BE v1

Bản nền backend được dựng theo cây chức năng:

- Xác thực nội bộ: `NguoiDung` với vai trò `ADMIN` và `BAC_SI`.
- Bác sĩ nội bộ: `BacSi`, liên kết 1-1 với `NguoiDung`.
- Bệnh nhân công khai: `BenhNhan`, chỉ cần họ tên + số điện thoại.
- Lịch làm việc: `LichLamViec`, phục vụ bước kiểm tra lịch bác sĩ.
- Lịch khám: `LichKham`, liên kết bác sĩ và bệnh nhân.

## 1. Yêu cầu

- Node.js 18+
- MongoDB local hoặc MongoDB Atlas

## 2. Cài đặt

```bash
npm install
```

Kiểm tra `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/phong_kham_v1
JWT_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_SECRET_BEFORE_DEPLOY
CLIENT_ORIGIN=http://localhost:5173
```

> JWT chưa được triển khai ở bản nền này; biến `JWT_SECRET` được chuẩn bị sẵn cho giai đoạn Auth tiếp theo.

## 3. Seed database

> Cảnh báo: script seed sẽ xóa dữ liệu trong 5 collection của database được cấu hình rồi tạo dữ liệu mẫu mới.

```bash
npm run seed
```

Tài khoản mẫu:

- Admin: `admin / Admin@123`
- Bác sĩ 1: `bacsi01 / Doctor@123`
- Bác sĩ 2: `bacsi02 / Doctor@123`

Mật khẩu được hash bằng bcrypt trước khi lưu database.

## 4. Chạy server

```bash
npm run dev
```

Test:

```text
GET http://localhost:5000/api/health
```

Kết quả mong đợi:

```json
{
  "success": true,
  "message": "Phòng khám BE v1 đang hoạt động",
  "database": "connected"
}
```

## 5. Quan hệ database

```text
NguoiDung
    │ 1:1
    ▼
  BacSi
    ├──────── 1:N ───────► LichLamViec
    │
    └──────── 1:N ───────► LichKham ◄──── N:1 ──── BenhNhan
```

Ở giai đoạn Bác sĩ/Hoàn thành khám sẽ bổ sung:

```text
LichKham → HoSoKham → DonThuoc
```

## 6. Quy ước

### Vai trò

- `ADMIN`
- `BAC_SI`

Bệnh nhân không có `NguoiDung` và không đăng nhập.

### Trạng thái lịch khám

- `CHO_KHAM`
- `HOAN_THANH`
- `DA_HUY`

### Thứ trong lịch làm việc

- `1` = Thứ 2
- `2` = Thứ 3
- `3` = Thứ 4
- `4` = Thứ 5
- `5` = Thứ 6
- `6` = Thứ 7
- `7` = Chủ nhật

## 7. Chưa triển khai trong bản này

Bản này cố ý chỉ hoàn thiện tầng database/nền server. Chưa có:

- `POST /api/auth/login`
- middleware JWT
- phân quyền `ADMIN/BAC_SI`
- API public đặt lịch / tra cứu / hủy lịch
- API bác sĩ
- API admin
- `HoSoKham`
- `DonThuoc`

Các phần trên nên được thêm theo từng nhánh chức năng sau khi 5 model và seed được test ổn định.
