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
// Helper lịch trống
// ========================================

function congNgay(
  ngay,
  soNgay
) {
  const [
    nam,
    thang,
    ngayTrongThang,
  ] = ngay
    .split('-')
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        nam,
        thang - 1,
        ngayTrongThang +
          soNgay
      )
    );

  return date
    .toISOString()
    .slice(0, 10);
}


function layThuTrongTuanTuNgay(
  ngay
) {
  const [
    nam,
    thang,
    ngayTrongThang,
  ] = ngay
    .split('-')
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        nam,
        thang - 1,
        ngayTrongThang
      )
    );

  const thuJS =
    date.getUTCDay();

  // JavaScript:
  // 0 = Chủ nhật
  // 1 = Thứ 2
  // ...
  // Model:
  // 1 = Thứ 2
  // ...
  // 7 = Chủ nhật

  return thuJS === 0
    ? 7
    : thuJS;
}


function gioSangPhut(gio) {
  const [
    gioSo,
    phutSo,
  ] = gio
    .split(':')
    .map(Number);

  return (
    gioSo * 60 +
    phutSo
  );
}


function phutSangGio(
  tongPhut
) {
  const gio =
    Math.floor(
      tongPhut / 60
    );

  const phut =
    tongPhut % 60;

  return (
    String(gio).padStart(
      2,
      '0'
    ) +
    ':' +
    String(phut).padStart(
      2,
      '0'
    )
  );
}


function taoThoiGianVietNam(
  ngay,
  gio
) {
  return new Date(
    `${ngay}T${gio}:00+07:00`
  );
}


const TEN_THU = {
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
  7: 'Chủ nhật',
};

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
// Lịch trống của bác sĩ trong 7 ngày tới
// ========================================

async function layLichTrong7Ngay(bacSiId) {
  if (!mongoose.Types.ObjectId.isValid(bacSiId)) {
    throw taoLoi('ID bác sĩ không hợp lệ');
  }

  const bacSi = await BacSi.findById(bacSiId).lean();

  if (!bacSi) {
    throw taoLoi('Không tìm thấy bác sĩ', 404);
  }

  const hienTai = new Date();
  const ngayHomNay = layThongTinThoiGian(hienTai).ngay;

  // Việt Nam UTC+7
  const batDauKhoang = new Date(`${ngayHomNay}T00:00:00+07:00`);
  const ketThucKhoang = new Date(batDauKhoang.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [lichLamViec, lichDaDat] = await Promise.all([
    LichLamViec.find({
      bacSiId,
      dangHoatDong: true,
    }).sort({
      thuTrongTuan: 1,
      gioBatDau: 1,
    }).lean(),

    LichKham.find({
      bacSiId,
      trangThai: { $ne: 'DA_HUY' },
      thoiGianBatDau: { $lt: ketThucKhoang },
      thoiGianKetThuc: { $gt: batDauKhoang },
    }).select('thoiGianBatDau thoiGianKetThuc').lean(),
  ]);

  const ketQua = [];

  for (let i = 0; i < 7; i++) {
    const ngayDate = new Date(batDauKhoang.getTime() + i * 24 * 60 * 60 * 1000);
    const thongTinNgay = layThongTinThoiGian(ngayDate);

    const caTrongNgay = lichLamViec.filter(
      (ca) => ca.thuTrongTuan === thongTinNgay.thuTrongTuan
    );

    const khungGio = [];

    for (const ca of caTrongNgay) {
      const [gioBatDau, phutBatDau] = ca.gioBatDau.split(':').map(Number);
      const [gioKetThuc, phutKetThuc] = ca.gioKetThuc.split(':').map(Number);

      const batDauPhut = gioBatDau * 60 + phutBatDau;
      const ketThucPhut = gioKetThuc * 60 + phutKetThuc;

      for (let phut = batDauPhut; phut + 30 <= ketThucPhut; phut += 30) {
        const gio = Math.floor(phut / 60);
        const phutTrongGio = phut % 60;

        const gioChuoi = `${String(gio).padStart(2, '0')}:${String(phutTrongGio).padStart(2, '0')}`;
        const batDauSlot = new Date(`${thongTinNgay.ngay}T${gioChuoi}:00+07:00`);
        const ketThucSlot = new Date(batDauSlot.getTime() + 30 * 60 * 1000);

        // Không hiện giờ đã qua
        if (batDauSlot <= hienTai) {
          continue;
        }

        const biTrung = lichDaDat.some((lich) => {
          const batDauDaDat = new Date(lich.thoiGianBatDau);
          const ketThucDaDat = new Date(lich.thoiGianKetThuc);

          return batDauDaDat < ketThucSlot && ketThucDaDat > batDauSlot;
        });

        if (!biTrung) {
          khungGio.push(gioChuoi);
        }
      }
    }

    ketQua.push({
      ngay: thongTinNgay.ngay,
      thuTrongTuan: thongTinNgay.thuTrongTuan,
      coLichLamViec: caTrongNgay.length > 0,
      khungGio: [...new Set(khungGio)].sort(),
    });
  }

  return ketQua;
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
  layLichTrong7Ngay,
  datLich,
  traCuuLich,
  huyLich,
};