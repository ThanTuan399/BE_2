const mongoose = require('mongoose');
const LichKham = require('../models/LichKham');

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

module.exports = {
  layLichKhamCuaBacSi,
};