const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const LichKham = require('../models/LichKham');
const BenhNhan = require('../models/BenhNhan');
const BacSi = require('../models/BacSi');
const NguoiDung = require('../models/NguoiDung');
const LichLamViec = require('../models/LichLamViec');
const ChuyenKhoa = require('../models/ChuyenKhoa');

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
// Thêm bác sĩ
// ========================================

async function themBacSi({
  hoTen,
  soDienThoai,
  tenDangNhap,
  matKhau,
  chuyenKhoaId,
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

    if (
    !mongoose.Types.ObjectId.isValid(
      chuyenKhoaId
    )
  ) {
    throw taoLoi(
      'Chuyên khoa không hợp lệ'
    );
  }

  const chuyenKhoa =
    await ChuyenKhoa.findById(
      chuyenKhoaId
    );

  if (!chuyenKhoa) {
    throw taoLoi(
      'Không tìm thấy chuyên khoa',
      404
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

        chuyenKhoaId,
      });

    return BacSi.findById(
      bacSi._id
    )
      .populate(
        'nguoiDungId',
        'tenDangNhap vaiTro'
      )
      .populate(
        'chuyenKhoaId',
        'tenChuyenKhoa'
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
    chuyenKhoaId,
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

  // Kiểm tra chuyên khoa

  if (
    !mongoose.Types.ObjectId.isValid(
      chuyenKhoaId
    )
  ) {
    throw taoLoi(
      'Chuyên khoa không hợp lệ'
    );
  }

  const chuyenKhoa =
    await ChuyenKhoa.findById(
      chuyenKhoaId
    );

  if (!chuyenKhoa) {
    throw taoLoi(
      'Không tìm thấy chuyên khoa',
      404
    );
  }

  // Tìm bác sĩ

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

  // Kiểm tra trùng SĐT

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

  // Cập nhật

  bacSi.hoTen =
    hoTen.trim();

  bacSi.soDienThoai =
    soDienThoai.trim();

  bacSi.chuyenKhoaId =
    chuyenKhoaId;

  await bacSi.save();

  return BacSi.findById(
    bacSi._id
  )
    .populate(
      'nguoiDungId',
      'tenDangNhap vaiTro'
    )
    .populate(
      'chuyenKhoaId',
      'tenChuyenKhoa'
    )
    .lean();
}

const HH_MM_REGEX =
  /^([01]\d|2[0-3]):([0-5]\d)$/;


// ========================================
// Danh sách lịch làm việc
// ========================================

async function layDanhSachLichLamViec() {
  return LichLamViec.find()
    .populate(
      'bacSiId',
      'hoTen soDienThoai'
    )
    .sort({
      bacSiId: 1,
      thuTrongTuan: 1,
      gioBatDau: 1,
    })
    .lean();
}


// ========================================
// Kiểm tra dữ liệu lịch làm việc
// ========================================

function kiemTraLichLamViec({
  bacSiId,
  thuTrongTuan,
  gioBatDau,
  gioKetThuc,
}) {
  if (
    !mongoose.Types.ObjectId.isValid(
      bacSiId
    )
  ) {
    throw taoLoi(
      'ID bác sĩ không hợp lệ'
    );
  }

  const thu = Number(
    thuTrongTuan
  );

  if (
    !Number.isInteger(thu) ||
    thu < 1 ||
    thu > 7
  ) {
    throw taoLoi(
      'Thứ trong tuần phải từ 1 đến 7'
    );
  }

  if (
    typeof gioBatDau !== 'string' ||
    typeof gioKetThuc !== 'string' ||
    !HH_MM_REGEX.test(gioBatDau) ||
    !HH_MM_REGEX.test(gioKetThuc)
  ) {
    throw taoLoi(
      'Giờ làm việc phải có dạng HH:mm'
    );
  }

  if (gioBatDau >= gioKetThuc) {
    throw taoLoi(
      'Giờ bắt đầu phải nhỏ hơn giờ kết thúc'
    );
  }

  return thu;
}


// ========================================
// Thêm lịch làm việc
// ========================================

async function themLichLamViec({
  bacSiId,
  thuTrongTuan,
  gioBatDau,
  gioKetThuc,
}) {
  const thu =
    kiemTraLichLamViec({
      bacSiId,
      thuTrongTuan,
      gioBatDau,
      gioKetThuc,
    });

  // 1. Kiểm tra bác sĩ tồn tại

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

  // 2. Không cho ca làm việc chồng nhau

  const lichTrung =
    await LichLamViec.findOne({
      bacSiId,
      thuTrongTuan: thu,
      dangHoatDong: true,

      gioBatDau: {
        $lt: gioKetThuc,
      },

      gioKetThuc: {
        $gt: gioBatDau,
      },
    });

  if (lichTrung) {
    throw taoLoi(
      'Ca làm việc bị trùng với lịch hiện có',
      409
    );
  }

  const lichLamViec =
    await LichLamViec.create({
      bacSiId,
      thuTrongTuan: thu,
      gioBatDau,
      gioKetThuc,
      dangHoatDong: true,
    });

  return LichLamViec.findById(
    lichLamViec._id
  )
    .populate(
      'bacSiId',
      'hoTen soDienThoai'
    )
    .lean();
}


// ========================================
// Cập nhật lịch làm việc
// ========================================

async function capNhatLichLamViec(
  lichLamViecId,
  {
    bacSiId,
    thuTrongTuan,
    gioBatDau,
    gioKetThuc,
    dangHoatDong,
  }
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      lichLamViecId
    )
  ) {
    throw taoLoi(
      'ID lịch làm việc không hợp lệ'
    );
  }

  const thu =
    kiemTraLichLamViec({
      bacSiId,
      thuTrongTuan,
      gioBatDau,
      gioKetThuc,
    });

  const lichLamViec =
    await LichLamViec.findById(
      lichLamViecId
    );

  if (!lichLamViec) {
    throw taoLoi(
      'Không tìm thấy lịch làm việc',
      404
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

  const hoatDongMoi =
    typeof dangHoatDong ===
    'boolean'
      ? dangHoatDong
      : lichLamViec.dangHoatDong;

  // Chỉ kiểm tra trùng nếu ca vẫn hoạt động
  if (hoatDongMoi) {
    const lichTrung =
      await LichLamViec.findOne({
        _id: {
          $ne: lichLamViecId,
        },

        bacSiId,
        thuTrongTuan: thu,
        dangHoatDong: true,

        gioBatDau: {
          $lt: gioKetThuc,
        },

        gioKetThuc: {
          $gt: gioBatDau,
        },
      });

    if (lichTrung) {
      throw taoLoi(
        'Ca làm việc bị trùng với lịch hiện có',
        409
      );
    }
  }

  lichLamViec.bacSiId =
    bacSiId;

  lichLamViec.thuTrongTuan =
    thu;

  lichLamViec.gioBatDau =
    gioBatDau;

  lichLamViec.gioKetThuc =
    gioKetThuc;

  lichLamViec.dangHoatDong =
    hoatDongMoi;

  await lichLamViec.save();

  return LichLamViec.findById(
    lichLamViec._id
  )
    .populate(
      'bacSiId',
      'hoTen soDienThoai'
    )
    .lean();
}


// ========================================
// Admin hủy lịch khám
// ========================================

async function huyLichKhamAdmin(
  lichKhamId
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      lichKhamId
    )
  ) {
    throw taoLoi(
      'ID lịch khám không hợp lệ'
    );
  }

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

  if (
    lichKham.trangThai ===
    'HOAN_THANH'
  ) {
    throw taoLoi(
      'Không thể hủy lịch đã hoàn thành',
      409
    );
  }

  if (
    lichKham.trangThai ===
    'DA_HUY'
  ) {
    throw taoLoi(
      'Lịch khám đã được hủy trước đó',
      409
    );
  }

  lichKham.trangThai =
    'DA_HUY';

  await lichKham.save();

  return LichKham.findById(
    lichKham._id
  )
    .populate(
      'bacSiId',
      'hoTen soDienThoai'
    )
    .populate(
      'benhNhanId',
      'hoTen soDienThoai'
    )
    .lean();
}

// ========================================
// Thống kê
// ========================================

async function layThongKe() {
  const [
    tongBenhNhan,
    tongBacSi,
    tongLichKham,
    choKham,
    hoanThanh,
    daHuy,
  ] = await Promise.all([
    BenhNhan.countDocuments(),

    BacSi.countDocuments(),

    LichKham.countDocuments(),

    LichKham.countDocuments({
      trangThai: 'CHO_KHAM',
    }),

    LichKham.countDocuments({
      trangThai: 'HOAN_THANH',
    }),

    LichKham.countDocuments({
      trangThai: 'DA_HUY',
    }),
  ]);

  // ==========================
  // Thống kê theo bác sĩ
  // ==========================

  const danhSachBacSi =
    await BacSi.find()
      .select(
        '_id hoTen soDienThoai'
      )
      .sort({
        hoTen: 1,
      })
      .lean();

  const theoBacSi =
    await Promise.all(
      danhSachBacSi.map(
        async (bacSi) => {
          const [
            tong,
            cho,
            hoanThanhBacSi,
            huy,
          ] = await Promise.all([
            LichKham.countDocuments({
              bacSiId: bacSi._id,
            }),

            LichKham.countDocuments({
              bacSiId: bacSi._id,
              trangThai: 'CHO_KHAM',
            }),

            LichKham.countDocuments({
              bacSiId: bacSi._id,
              trangThai: 'HOAN_THANH',
            }),

            LichKham.countDocuments({
              bacSiId: bacSi._id,
              trangThai: 'DA_HUY',
            }),
          ]);

          return {
            bacSiId: bacSi._id,
            hoTen: bacSi.hoTen,
            soDienThoai:
              bacSi.soDienThoai,

            tongLich: tong,
            choKham: cho,
            hoanThanh:
              hoanThanhBacSi,
            daHuy: huy,
          };
        }
      )
    );

  const tyLeHoanThanh =
    tongLichKham > 0
      ? Math.round(
          (
            hoanThanh /
            tongLichKham
          ) * 100
        )
      : 0;

  return {
    tongQuan: {
      tongBenhNhan,
      tongBacSi,
      tongLichKham,
      choKham,
      hoanThanh,
      daHuy,
      tyLeHoanThanh,
    },

    theoBacSi,
  };
}


// ========================================
// Danh sách chuyên khoa
// ========================================

async function layDanhSachChuyenKhoa() {
  return ChuyenKhoa.find()
    .sort({
      tenChuyenKhoa: 1,
    })
    .lean();
}


// ========================================
// Thêm chuyên khoa
// ========================================

async function themChuyenKhoa({
  tenChuyenKhoa,
}) {
  if (
    typeof tenChuyenKhoa !==
      'string' ||
    !tenChuyenKhoa.trim()
  ) {
    throw taoLoi(
      'Tên chuyên khoa là bắt buộc'
    );
  }

  const ten =
    tenChuyenKhoa.trim();

  const daTonTai =
    await ChuyenKhoa.findOne({
      tenChuyenKhoa: ten,
    });

  if (daTonTai) {
    throw taoLoi(
      'Chuyên khoa đã tồn tại',
      409
    );
  }

  return ChuyenKhoa.create({
    tenChuyenKhoa: ten,
  });
}


// ========================================
// Sửa chuyên khoa
// ========================================

async function capNhatChuyenKhoa(
  id,
  {
    tenChuyenKhoa,
  }
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    throw taoLoi(
      'ID chuyên khoa không hợp lệ'
    );
  }

  if (
    typeof tenChuyenKhoa !==
      'string' ||
    !tenChuyenKhoa.trim()
  ) {
    throw taoLoi(
      'Tên chuyên khoa là bắt buộc'
    );
  }

  const chuyenKhoa =
    await ChuyenKhoa.findById(id);

  if (!chuyenKhoa) {
    throw taoLoi(
      'Không tìm thấy chuyên khoa',
      404
    );
  }

  const trungTen =
    await ChuyenKhoa.findOne({
      tenChuyenKhoa:
        tenChuyenKhoa.trim(),

      _id: {
        $ne: id,
      },
    });

  if (trungTen) {
    throw taoLoi(
      'Tên chuyên khoa đã tồn tại',
      409
    );
  }

  chuyenKhoa.tenChuyenKhoa =
    tenChuyenKhoa.trim();

  await chuyenKhoa.save();

  return chuyenKhoa;
}


// ========================================
// Xóa chuyên khoa
// ========================================

async function xoaChuyenKhoa(id) {
  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    throw taoLoi(
      'ID chuyên khoa không hợp lệ'
    );
  }

  const chuyenKhoa =
    await ChuyenKhoa.findById(id);

  if (!chuyenKhoa) {
    throw taoLoi(
      'Không tìm thấy chuyên khoa',
      404
    );
  }

  const soBacSi =
    await BacSi.countDocuments({
      chuyenKhoaId: id,
    });

  if (soBacSi > 0) {
    throw taoLoi(
      'Không thể xóa chuyên khoa đang có bác sĩ sử dụng',
      409
    );
  }

  await chuyenKhoa.deleteOne();

  return {
    _id: id,
  };
}

module.exports = {
  layTatCaLichKham,
  layDanhSachBenhNhan,
  layDanhSachBacSi,
  themBacSi,
  capNhatBacSi,

  // nếu đã làm lịch làm việc
  layDanhSachLichLamViec,
  themLichLamViec,
  capNhatLichLamViec,

  huyLichKhamAdmin,

  layThongKe,

  layDanhSachChuyenKhoa,
  themChuyenKhoa,
  capNhatChuyenKhoa,
  xoaChuyenKhoa,
};