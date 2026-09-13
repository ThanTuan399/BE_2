const mongoose = require('mongoose');

const BacSi = require('../models/BacSi');
const BenhNhan = require('../models/BenhNhan');
const LichLamViec = require('../models/LichLamViec');
const LichKham = require('../models/LichKham');
const HoSoKham = require('../models/HoSoKham');
const DonThuoc = require('../models/DonThuoc');

const TIME_ZONE = 'Asia/Ho_Chi_Minh';


// ========================================
// Helper
// ========================================

function taoLoi(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function layThongTinThoiGian(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const data = {};

  for (const part of parts) {
    data[part.type] = part.value;
  }

  const mapThu = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return {
    ngay: `${data.year}-${data.month}-${data.day}`,
    thuTrongTuan: mapThu[data.weekday],
    gio: `${data.hour}:${data.minute}`,
  };
}


// ========================================
// Danh sách bác sĩ
// ========================================

async function layDanhSachBacSi() {
  return BacSi.find()
    .select(
      '_id hoTen soDienThoai chuyenKhoaId'
    )
    .populate(
      'chuyenKhoaId',
      'tenChuyenKhoa'
    )
    .sort({
      hoTen: 1,
    })
    .lean();
}


// ========================================
// Đặt lịch khám
// ========================================

async function datLich({
  hoTen,
  soDienThoai,
  bacSiId,
  thoiGianBatDau,
}) {
  // 1. Validate dữ liệu đầu vào
  if (
    typeof hoTen !== 'string' ||
    typeof soDienThoai !== 'string' ||
    !hoTen.trim() ||
    !soDienThoai.trim() ||
    !bacSiId ||
    !thoiGianBatDau
  ) {
    throw taoLoi('Vui lòng nhập đầy đủ thông tin');
  }

  if (!/^0\d{9}$/.test(soDienThoai.trim())) {
    throw taoLoi(
      'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'
    );
  }

  if (!mongoose.Types.ObjectId.isValid(bacSiId)) {
    throw taoLoi('bacSiId không hợp lệ');
  }

  const batDau = new Date(thoiGianBatDau);

  if (Number.isNaN(batDau.getTime())) {
    throw taoLoi('Thời gian khám không hợp lệ');
  }

  if (batDau <= new Date()) {
    throw taoLoi('Không thể đặt lịch trong quá khứ');
  }

  // Mỗi ca khám cố định 30 phút
  const THOI_LUONG_CA_KHAM = 30 * 60 * 1000;

  const ketThuc = new Date(
    batDau.getTime() + THOI_LUONG_CA_KHAM
  );

  // 2. Kiểm tra bác sĩ
  const bacSi = await BacSi.findById(bacSiId);

  if (!bacSi) {
    throw taoLoi('Không tìm thấy bác sĩ', 404);
  }

  // 3. Lấy ngày, thứ và giờ theo giờ Việt Nam
  const thongTinBatDau = layThongTinThoiGian(batDau);
  const thongTinKetThuc = layThongTinThoiGian(ketThuc);

  if (
    thongTinBatDau.ngay !== thongTinKetThuc.ngay
  ) {
    throw taoLoi(
      'Một lịch khám phải bắt đầu và kết thúc trong cùng một ngày'
    );
  }

  // 4. Kiểm tra lịch làm việc bác sĩ
  const lichLamViec = await LichLamViec.findOne({
    bacSiId,
    thuTrongTuan: thongTinBatDau.thuTrongTuan,
    dangHoatDong: true,
    gioBatDau: {
      $lte: thongTinBatDau.gio,
    },
    gioKetThuc: {
      $gte: thongTinKetThuc.gio,
    },
  });

  if (!lichLamViec) {
    throw taoLoi(
      'Bác sĩ không làm việc trong khung giờ đã chọn',
      409
    );
  }

  // 5. Kiểm tra trùng lịch
  const lichTrung = await LichKham.findOne({
    bacSiId,
    trangThai: {
      $ne: 'DA_HUY',
    },
    thoiGianBatDau: {
      $lt: ketThuc,
    },
    thoiGianKetThuc: {
      $gt: batDau,
    },
  });

  if (lichTrung) {
    throw taoLoi(
      'Khung giờ này đã có lịch khám',
      409
    );
  }

  // 6. Tìm hoặc tạo bệnh nhân theo SĐT
  let benhNhan = await BenhNhan.findOne({
    soDienThoai: soDienThoai.trim(),
  });

  if (!benhNhan) {
    benhNhan = await BenhNhan.create({
      hoTen: hoTen.trim(),
      soDienThoai: soDienThoai.trim(),
    });
  }

  // 7. Tạo lịch khám
  const lichKham = await LichKham.create({
    bacSiId,
    benhNhanId: benhNhan._id,
    thoiGianBatDau: batDau,
    thoiGianKetThuc: ketThuc,
    trangThai: 'CHO_KHAM',
  });

  return LichKham.findById(lichKham._id)
    .populate({
      path: 'bacSiId',

      select:
        'hoTen soDienThoai chuyenKhoaId',

      populate: {
        path: 'chuyenKhoaId',
        select: 'tenChuyenKhoa',
      },
    })
    .populate('benhNhanId', 'hoTen soDienThoai')
    .lean();
}


// ========================================
// Tra cứu lịch khám
// ========================================

async function traCuuLich(soDienThoai) {
  if (
    typeof soDienThoai !== 'string' ||
    !/^0\d{9}$/.test(soDienThoai.trim())
  ) {
    throw taoLoi(
      'Số điện thoại không hợp lệ'
    );
  }

  // 1. Tìm bệnh nhân
  const benhNhan = await BenhNhan.findOne({
    soDienThoai: soDienThoai.trim(),
  }).lean();

  if (!benhNhan) {
    throw taoLoi(
      'Không tìm thấy bệnh nhân',
      404
    );
  }

  // 2. Lấy toàn bộ lịch khám
  const lichKham = await LichKham.find({
    benhNhanId: benhNhan._id,
  })
    .populate({
      path: 'bacSiId',

      select:
        'hoTen soDienThoai chuyenKhoaId',

      populate: {
        path: 'chuyenKhoaId',
        select: 'tenChuyenKhoa',
      },
    })
    .sort({
      thoiGianBatDau: -1,
    })
    .lean();

  // 3. Chỉ tìm hồ sơ cho những lịch
  // đã hoàn thành
  const lichHoanThanhIds = lichKham
    .filter(
      (lich) =>
        lich.trangThai === 'HOAN_THANH'
    )
    .map((lich) => lich._id);

  const hoSoKham =
    await HoSoKham.find({
      lichKhamId: {
        $in: lichHoanThanhIds,
      },
    }).lean();

  // 4. Lấy đơn thuốc
  const hoSoIds = hoSoKham.map(
    (hoSo) => hoSo._id
  );

  const donThuoc =
    await DonThuoc.find({
      hoSoKhamId: {
        $in: hoSoIds,
      },
    }).lean();

  // 5. Map hồ sơ theo lichKhamId
  const hoSoMap = new Map();

  for (const hoSo of hoSoKham) {
    hoSoMap.set(
      hoSo.lichKhamId.toString(),
      hoSo
    );
  }

  // 6. Map đơn thuốc theo hoSoKhamId
  const donThuocMap = new Map();

  for (const don of donThuoc) {
    donThuocMap.set(
      don.hoSoKhamId.toString(),
      don
    );
  }

  // 7. Ghép dữ liệu
  const danhSachLich = lichKham.map(
    (lich) => {
      if (
        lich.trangThai !==
        'HOAN_THANH'
      ) {
        return {
          ...lich,
          hoSoKham: null,
          donThuoc: null,
        };
      }

      const hoSo =
        hoSoMap.get(
          lich._id.toString()
        ) || null;

      const don =
        hoSo
          ? donThuocMap.get(
              hoSo._id.toString()
            ) || null
          : null;

      return {
        ...lich,
        hoSoKham: hoSo,
        donThuoc: don,
      };
    }
  );

  return {
    benhNhan,
    lichKham: danhSachLich,
  };
}


// ========================================
// Hủy lịch khám
// ========================================

async function huyLich(lichKhamId, soDienThoai) {
  if (!mongoose.Types.ObjectId.isValid(lichKhamId)) {
    throw taoLoi('ID lịch khám không hợp lệ');
  }

  if (
    typeof soDienThoai !== 'string' ||
    !/^0\d{9}$/.test(soDienThoai.trim())
  ) {
    throw taoLoi('Số điện thoại không hợp lệ');
  }

  const benhNhan = await BenhNhan.findOne({
    soDienThoai: soDienThoai.trim(),
  });

  if (!benhNhan) {
    throw taoLoi('Không tìm thấy bệnh nhân', 404);
  }

  const lichKham = await LichKham.findById(
    lichKhamId
  );

  if (!lichKham) {
    throw taoLoi('Không tìm thấy lịch khám', 404);
  }

  // Xác nhận lịch thuộc bệnh nhân này
  if (
    lichKham.benhNhanId.toString() !==
    benhNhan._id.toString()
  ) {
    throw taoLoi(
      'Bạn không có quyền hủy lịch này',
      403
    );
  }

  if (lichKham.trangThai !== 'CHO_KHAM') {
    throw taoLoi(
      'Chỉ có thể hủy lịch đang chờ khám',
      409
    );
  }

  lichKham.trangThai = 'DA_HUY';

  await lichKham.save();

  return lichKham;
}




module.exports = {
  layDanhSachBacSi,
  datLich,
  traCuuLich,
  huyLich,
};