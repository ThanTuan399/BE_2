const mongoose = require('mongoose');
const BacSi = require('../models/BacSi');
const NguoiDung = require('../models/NguoiDung');
const LichLamViec = require('../models/LichLamViec');
const LichKham = require('../models/LichKham');

function taoLoi(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function xoaBacSi(bacSiId) {
  if (!mongoose.Types.ObjectId.isValid(bacSiId)) throw taoLoi('ID bác sĩ không hợp lệ');

  const bacSi = await BacSi.findById(bacSiId);
  if (!bacSi) throw taoLoi('Không tìm thấy bác sĩ', 404);

  const soLichKham = await LichKham.countDocuments({ bacSiId });
  if (soLichKham > 0) throw taoLoi('Không thể xóa bác sĩ đã có lịch khám', 409);

  const ketQuaXoaLichLamViec = await LichLamViec.deleteMany({ bacSiId });
  const nguoiDungId = bacSi.nguoiDungId;

  await bacSi.deleteOne();
  if (nguoiDungId) await NguoiDung.findByIdAndDelete(nguoiDungId);

  return { _id: bacSiId, nguoiDungId, soLichLamViecDaXoa: ketQuaXoaLichLamViec.deletedCount };
}

module.exports = { xoaBacSi };
