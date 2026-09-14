require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDatabase = require('../config/database');

const NguoiDung = require('../models/NguoiDung');
const BacSi = require('../models/BacSi');
const BenhNhan = require('../models/BenhNhan');
const LichLamViec = require('../models/LichLamViec');
const LichKham = require('../models/LichKham');
const ChuyenKhoa = require('../models/ChuyenKhoa');
const HoSoKham = require('../models/HoSoKham');
const DonThuoc = require('../models/DonThuoc');

async function seed() {
  try {
    await connectDatabase();
    
      // về bảng gốc.
      await DonThuoc.deleteMany({});

      await HoSoKham.deleteMany({});

      await Promise.all([
        LichKham.deleteMany({}),
        LichLamViec.deleteMany({}),
      ]);

      await Promise.all([
        BenhNhan.deleteMany({}),
        BacSi.deleteMany({}),
      ]);

      await ChuyenKhoa.deleteMany({});
      await NguoiDung.deleteMany({});

    const hashedAdminPassword = await bcrypt.hash('Admin@123', 12);
    const hashedDoctorPassword = await bcrypt.hash('Doctor@123', 12);

    const [adminUser, doctorUser1, doctorUser2] = await NguoiDung.create([
      {
        tenDangNhap: 'admin',
        matKhau: hashedAdminPassword,
        vaiTro: 'ADMIN',
      },
      {
        tenDangNhap: 'bacsi01',
        matKhau: hashedDoctorPassword,
        vaiTro: 'BAC_SI',
      },
      {
        tenDangNhap: 'bacsi02',
        matKhau: hashedDoctorPassword,
        vaiTro: 'BAC_SI',
      },
    ]);

    const [
      noiKhoa,
      nhiKhoa,
    ] = await ChuyenKhoa.create([
      {
        tenChuyenKhoa:
          'Nội khoa',
      },
      {
        tenChuyenKhoa:
          'Nhi khoa',
      },
    ]);

    const [bacSi1, bacSi2] = await BacSi.create([
      {
        nguoiDungId: doctorUser1._id,
        hoTen: 'Nguyễn Minh Anh',
        soDienThoai: '0901234567',
        chuyenKhoaId: noiKhoa._id,
      },
      {
        nguoiDungId: doctorUser2._id,
        hoTen: 'Trần Thu Hà',
        soDienThoai: '0912345678',
        chuyenKhoaId: nhiKhoa._id,
      },
    ]);

    const [benhNhan1, benhNhan2] = await BenhNhan.create([
      {
        hoTen: 'Phạm Văn Nam',
        soDienThoai: '0981111111',
      },
      {
        hoTen: 'Lê Thị Hương',
        soDienThoai: '0982222222',
      },
    ]);

    // 1 = Thứ 2 ... 7 = Chủ nhật.
    await LichLamViec.create([
      {
        bacSiId: bacSi1._id,
        thuTrongTuan: 1,
        gioBatDau: '08:00',
        gioKetThuc: '12:00',
      },
      {
        bacSiId: bacSi1._id,
        thuTrongTuan: 1,
        gioBatDau: '13:30',
        gioKetThuc: '17:00',
      },
      {
        bacSiId: bacSi1._id,
        thuTrongTuan: 3,
        gioBatDau: '08:00',
        gioKetThuc: '12:00',
      },
      {
        bacSiId: bacSi2._id,
        thuTrongTuan: 2,
        gioBatDau: '08:00',
        gioKetThuc: '12:00',
      },
      {
        bacSiId: bacSi2._id,
        thuTrongTuan: 4,
        gioBatDau: '13:30',
        gioKetThuc: '17:00',
      },
    ]);

    // Dữ liệu lịch mẫu. Mốc thời gian lưu theo ISO UTC.
    await LichKham.create([
      {
        bacSiId: bacSi1._id,
        benhNhanId: benhNhan1._id,
        thoiGianBatDau: new Date('2026-09-14T01:00:00.000Z'),
        thoiGianKetThuc: new Date('2026-09-14T01:30:00.000Z'),
        trangThai: 'CHO_KHAM',
      },
      {
        bacSiId: bacSi2._id,
        benhNhanId: benhNhan2._id,
        thoiGianBatDau: new Date('2026-09-15T02:00:00.000Z'),
        thoiGianKetThuc: new Date('2026-09-15T02:30:00.000Z'),
        trangThai: 'CHO_KHAM',
      },
      {
        bacSiId: bacSi1._id,
        benhNhanId: benhNhan2._id,
        thoiGianBatDau: new Date('2026-09-16T01:30:00.000Z'),
        thoiGianKetThuc: new Date('2026-09-16T02:00:00.000Z'),
        trangThai: 'DA_HUY',
      },
    ]);

    console.log('\nSeed hoàn tất.');
    console.log('Tài khoản mẫu:');
    console.log('  ADMIN  -> admin / Admin@123');
    console.log('  BAC_SI -> bacsi01 / Doctor@123');
    console.log('  BAC_SI -> bacsi02 / Doctor@123');
    console.log(`Admin id: ${adminUser._id}`);
  } catch (error) {
    console.error('Seed thất bại:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
