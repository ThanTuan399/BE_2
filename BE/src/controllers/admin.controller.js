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


module.exports = {
  layTatCaLichKham,
  layDanhSachBenhNhan,
  layDanhSachBacSi,
  themBacSi,
  capNhatBacSi,
};