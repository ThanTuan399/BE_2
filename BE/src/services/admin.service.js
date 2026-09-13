const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const LichKham = require('../models/LichKham');
const BenhNhan = require('../models/BenhNhan');
const BacSi = require('../models/BacSi');
const NguoiDung = require('../models/NguoiDung');

function taoLoi(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}


// ========================================
// Toàn bộ lịch khám
// ========================================

async function layTatCaLichKham() {
  return LichKham.find()
    .populate(
      'bacSiId',
      'hoTen soDienThoai'
    )
    .populate(
      'benhNhanId',
      'hoTen soDienThoai'
    )
    .sort({
      thoiGianBatDau: -1,
    })
    .lean();
}


// ========================================
// Danh sách bệnh nhân
// ========================================

async function layDanhSachBenhNhan() {
  const danhSachBenhNhan =
    await BenhNhan.find()
      .sort({
        createdAt: -1,
      })
      .lean();

  const ketQua =
    await Promise.all(
      danhSachBenhNhan.map(
        async (benhNhan) => {
          const soLichKham =
            await LichKham.countDocuments({
              benhNhanId:
                benhNhan._id,
            });

          return {
            ...benhNhan,
            soLichKham,
          };
        }
      )
    );

  return ketQua;
}


// ========================================
// Danh sách bác sĩ
// ========================================

async function layDanhSachBacSi() {
  return BacSi.find()
    .populate(
      'nguoiDungId',
      'tenDangNhap vaiTro'
    )
    .sort({
      hoTen: 1,
    })
    .lean();
}


// ========================================
// Thêm bác sĩ
// ========================================

async function themBacSi({
  hoTen,
  soDienThoai,
  tenDangNhap,
  matKhau,
}) {
  // 1. Validate

  if (
    typeof hoTen !== 'string' ||
    typeof soDienThoai !== 'string' ||
    typeof tenDangNhap !== 'string' ||
    typeof matKhau !== 'string' ||
    !hoTen.trim() ||
    !soDienThoai.trim() ||
    !tenDangNhap.trim() ||
    !matKhau
  ) {
    throw taoLoi(
      'Vui lòng nhập đầy đủ thông tin bác sĩ'
    );
  }

  if (hoTen.trim().length < 2) {
    throw taoLoi(
      'Họ tên bác sĩ không hợp lệ'
    );
  }

  if (
    !/^0\d{9}$/.test(
      soDienThoai.trim()
    )
  ) {
    throw taoLoi(
      'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'
    );
  }

  const username =
    tenDangNhap
      .trim()
      .toLowerCase();

  if (username.length < 4) {
    throw taoLoi(
      'Tên đăng nhập phải có ít nhất 4 ký tự'
    );
  }

  if (matKhau.length < 6) {
    throw taoLoi(
      'Mật khẩu phải có ít nhất 6 ký tự'
    );
  }

  // 2. Kiểm tra username

  const taiKhoanDaTonTai =
    await NguoiDung.findOne({
      tenDangNhap: username,
    });

  if (taiKhoanDaTonTai) {
    throw taoLoi(
      'Tên đăng nhập đã tồn tại',
      409
    );
  }

  // 3. Kiểm tra số điện thoại

  const bacSiDaTonTai =
    await BacSi.findOne({
      soDienThoai:
        soDienThoai.trim(),
    });

  if (bacSiDaTonTai) {
    throw taoLoi(
      'Số điện thoại bác sĩ đã tồn tại',
      409
    );
  }

  // 4. Hash mật khẩu

  const matKhauHash =
    await bcrypt.hash(
      matKhau,
      12
    );

  let nguoiDung = null;

  try {
    // 5. Tạo tài khoản BAC_SI

    nguoiDung =
      await NguoiDung.create({
        tenDangNhap: username,
        matKhau: matKhauHash,
        vaiTro: 'BAC_SI',
      });

    // 6. Tạo hồ sơ bác sĩ

    const bacSi =
      await BacSi.create({
        nguoiDungId:
          nguoiDung._id,

        hoTen:
          hoTen.trim(),

        soDienThoai:
          soDienThoai.trim(),
      });

    return BacSi.findById(
      bacSi._id
    )
      .populate(
        'nguoiDungId',
        'tenDangNhap vaiTro'
      )
      .lean();
  } catch (error) {
    // Nếu tạo tài khoản thành công
    // nhưng tạo hồ sơ bác sĩ lỗi
    // thì xóa tài khoản vừa tạo.

    if (nguoiDung) {
      await NguoiDung.findByIdAndDelete(
        nguoiDung._id
      );
    }

    throw error;
  }
}


// ========================================
// Cập nhật bác sĩ
// ========================================

async function capNhatBacSi(
  bacSiId,
  {
    hoTen,
    soDienThoai,
  }
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      bacSiId
    )
  ) {
    throw taoLoi(
      'ID bác sĩ không hợp lệ'
    );
  }

  if (
    typeof hoTen !== 'string' ||
    typeof soDienThoai !== 'string' ||
    !hoTen.trim() ||
    !soDienThoai.trim()
  ) {
    throw taoLoi(
      'Họ tên và số điện thoại là bắt buộc'
    );
  }

  if (
    !/^0\d{9}$/.test(
      soDienThoai.trim()
    )
  ) {
    throw taoLoi(
      'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'
    );
  }

  const bacSi =
    await BacSi.findById(
      bacSiId
    );

  if (!bacSi) {
    throw taoLoi(
      'Không tìm thấy bác sĩ',
      404
    );
  }

  const trungSoDienThoai =
    await BacSi.findOne({
      soDienThoai:
        soDienThoai.trim(),

      _id: {
        $ne: bacSiId,
      },
    });

  if (trungSoDienThoai) {
    throw taoLoi(
      'Số điện thoại đã được sử dụng bởi bác sĩ khác',
      409
    );
  }

  bacSi.hoTen =
    hoTen.trim();

  bacSi.soDienThoai =
    soDienThoai.trim();

  await bacSi.save();

  return BacSi.findById(
    bacSi._id
  )
    .populate(
      'nguoiDungId',
      'tenDangNhap vaiTro'
    )
    .lean();
}


module.exports = {
  layTatCaLichKham,
  layDanhSachBenhNhan,
  layDanhSachBacSi,
  themBacSi,
  capNhatBacSi,
};