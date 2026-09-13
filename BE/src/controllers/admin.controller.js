const adminService =
  require('../services/admin.service');


// ========================================
// Lịch khám
// ========================================

async function layTatCaLichKham(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layTatCaLichKham();

    return res.status(200).json({
      success: true,
      message:
        'Lấy danh sách lịch khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// ========================================
// Bệnh nhân
// ========================================

async function layDanhSachBenhNhan(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layDanhSachBenhNhan();

    return res.status(200).json({
      success: true,
      message:
        'Lấy danh sách bệnh nhân thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// ========================================
// Danh sách bác sĩ
// ========================================

async function layDanhSachBacSi(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layDanhSachBacSi();

    return res.status(200).json({
      success: true,
      message:
        'Lấy danh sách bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// ========================================
// Thêm bác sĩ
// ========================================

async function themBacSi(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .themBacSi(req.body);

    return res.status(201).json({
      success: true,
      message:
        'Thêm bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// ========================================
// Cập nhật bác sĩ
// ========================================

async function capNhatBacSi(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .capNhatBacSi(
          req.params.id,
          req.body
        );

    return res.status(200).json({
      success: true,
      message:
        'Cập nhật bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function layDanhSachLichLamViec(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layDanhSachLichLamViec();

    return res.status(200).json({
      success: true,
      message:
        'Lấy lịch làm việc thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


async function themLichLamViec(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .themLichLamViec(
          req.body
        );

    return res.status(201).json({
      success: true,
      message:
        'Thêm lịch làm việc thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


async function capNhatLichLamViec(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .capNhatLichLamViec(
          req.params.id,
          req.body
        );

    return res.status(200).json({
      success: true,
      message:
        'Cập nhật lịch làm việc thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// ========================================
// Admin hủy lịch khám
// ========================================

async function huyLichKham(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .huyLichKhamAdmin(
          req.params.id
        );

    return res.status(200).json({
      success: true,
      message:
        'Hủy lịch khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// ========================================
// Thống kê
// ========================================

async function layThongKe(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layThongKe();

    return res.status(200).json({
      success: true,
      message:
        'Lấy thống kê thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function layDanhSachChuyenKhoa(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .layDanhSachChuyenKhoa();

    return res.status(200).json({
      success: true,
      message:
        'Lấy danh sách chuyên khoa thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


async function themChuyenKhoa(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .themChuyenKhoa(
          req.body
        );

    return res.status(201).json({
      success: true,
      message:
        'Thêm chuyên khoa thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


async function capNhatChuyenKhoa(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .capNhatChuyenKhoa(
          req.params.id,
          req.body
        );

    return res.status(200).json({
      success: true,
      message:
        'Cập nhật chuyên khoa thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


async function xoaChuyenKhoa(
  req,
  res,
  next
) {
  try {
    const data =
      await adminService
        .xoaChuyenKhoa(
          req.params.id
        );

    return res.status(200).json({
      success: true,
      message:
        'Xóa chuyên khoa thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  layTatCaLichKham,
  layDanhSachBenhNhan,
  layDanhSachBacSi,
  themBacSi,
  capNhatBacSi,
  layDanhSachLichLamViec,
  themLichLamViec,
  capNhatLichLamViec,
  huyLichKham,
  layThongKe,
  layDanhSachChuyenKhoa,
  themChuyenKhoa,
  capNhatChuyenKhoa,
  xoaChuyenKhoa,
};