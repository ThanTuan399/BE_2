const mongoose = require('mongoose');
const LichKham = require('../models/LichKham');
const HoSoKham = require('../models/HoSoKham');
const DonThuoc = require('../models/DonThuoc');
const BacSi = require('../models/BacSi');

function taoLoi(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function layLichKhamCuaBacSi(bacSiId) {
  if (!bacSiId) {
    throw taoLoi(
      'Không xác định được bác sĩ từ tài khoản đăng nhập',
      401
    );
  }

  if (!mongoose.Types.ObjectId.isValid(bacSiId)) {
    throw taoLoi('bacSiId không hợp lệ', 400);
  }

  const danhSachLich = await LichKham.find({
    bacSiId,
  })
    .populate(
      'benhNhanId',
      'hoTen soDienThoai'
    )
    .sort({
      thoiGianBatDau: 1,
    })
    .lean();

  return danhSachLich;
}

async function hoanThanhKham(
  bacSiId,
  {
    lichKhamId,
    trieuChung,
    chanDoan,
    chiTietThuoc,
  }
) {
  // =========================
  // 1. Validate
  // =========================

  if (!bacSiId) {
    throw taoLoi(
      'Không xác định được bác sĩ đăng nhập',
      401
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      lichKhamId
    )
  ) {
    throw taoLoi(
      'lichKhamId không hợp lệ'
    );
  }

  if (
    typeof trieuChung !== 'string' ||
    !trieuChung.trim() ||
    typeof chanDoan !== 'string' ||
    !chanDoan.trim() ||
    typeof chiTietThuoc !== 'string' ||
    !chiTietThuoc.trim()
  ) {
    throw taoLoi(
      'Triệu chứng, chẩn đoán và đơn thuốc là bắt buộc'
    );
  }

  // =========================
  // 2. Tìm lịch khám
  // =========================

  const lichKham =
    await LichKham.findById(
      lichKhamId
    );

  if (!lichKham) {
    throw taoLoi(
      'Không tìm thấy lịch khám',
      404
    );
  }

  // =========================
  // 3. Kiểm tra đúng bác sĩ
  // =========================

  if (
    lichKham.bacSiId.toString() !==
    bacSiId.toString()
  ) {
    throw taoLoi(
      'Bạn không có quyền hoàn thành lịch khám này',
      403
    );
  }

  // =========================
  // 4. Kiểm tra trạng thái
  // =========================

  if (lichKham.trangThai === 'DA_HUY') {
    throw taoLoi(
      'Không thể hoàn thành lịch đã hủy',
      409
    );
  }

  if (
    lichKham.trangThai ===
    'HOAN_THANH'
  ) {
    throw taoLoi(
      'Lịch khám đã hoàn thành',
      409
    );
  }

  // =========================
  // 5. Không cho tạo hồ sơ trùng
  // =========================

  const hoSoCu =
    await HoSoKham.findOne({
      lichKhamId,
    });

  if (hoSoCu) {
    throw taoLoi(
      'Lịch khám này đã có hồ sơ khám',
      409
    );
  }

  let hoSoKham = null;
  let donThuoc = null;

  try {
    // =========================
    // 6. Tạo hồ sơ khám
    // =========================

    hoSoKham =
      await HoSoKham.create({
        lichKhamId,
        trieuChung:
          trieuChung.trim(),
        chanDoan:
          chanDoan.trim(),
      });

    // =========================
    // 7. Tạo đơn thuốc
    // =========================

    donThuoc =
      await DonThuoc.create({
        hoSoKhamId:
          hoSoKham._id,

        chiTietThuoc:
          chiTietThuoc.trim(),
      });

    // =========================
    // 8. Hoàn thành lịch
    // =========================

    lichKham.trangThai =
      'HOAN_THANH';

    await lichKham.save();

    return {
      lichKham,
      hoSoKham,
      donThuoc,
    };
  } catch (error) {
    // Rollback thủ công nếu một bước lỗi

    if (donThuoc) {
      await DonThuoc.findByIdAndDelete(
        donThuoc._id
      );
    }

    if (hoSoKham) {
      await HoSoKham.findByIdAndDelete(
        hoSoKham._id
      );
    }

    throw error;
  }
}


async function layThongTinBacSi(
  bacSiId
) {
  if (
    !bacSiId ||
    !mongoose.Types.ObjectId.isValid(
      bacSiId
    )
  ) {
    throw taoLoi(
      'ID bác sĩ không hợp lệ',
      400
    );
  }

  const bacSi =
    await BacSi.findById(
      bacSiId
    )
      .select(
        '_id hoTen soDienThoai chuyenKhoaId'
      )
      .populate(
        'chuyenKhoaId',
        'tenChuyenKhoa'
      )
      .lean();

  if (!bacSi) {
    throw taoLoi(
      'Không tìm thấy bác sĩ',
      404
    );
  }

  return bacSi;
}
module.exports = {
  layThongTinBacSi,
  layLichKhamCuaBacSi,
  hoanThanhKham,
};