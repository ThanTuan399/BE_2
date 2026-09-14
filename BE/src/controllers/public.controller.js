const publicService = require(
  '../services/public.service'
);


// Danh sách bác sĩ
async function layDanhSachBacSi(req, res, next) {
  try {
    const data =
      await publicService.layDanhSachBacSi();

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

// Lịch trống 7 ngày tới
async function layLichTrong(req, res, next) {
  try {
    const data = await publicService.layLichTrong7Ngay(req.params.bacSiId);

    return res.status(200).json({
      success: true,
      message: 'Lấy lịch trống của bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Đặt lịch
async function datLich(req, res, next) {
  try {
    const data =
      await publicService.datLich(req.body);

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// Tra cứu
async function traCuuLich(req, res, next) {
  try {
    const data =
      await publicService.traCuuLich(
        req.params.soDienThoai
      );

    return res.status(200).json({
      success: true,
      message:
        'Tra cứu lịch khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


// Hủy lịch
async function huyLich(req, res, next) {
  try {
    const data =
      await publicService.huyLich(
        req.params.id,
        req.body.soDienThoai
      );

    return res.status(200).json({
      success: true,
      message: 'Hủy lịch khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  layDanhSachBacSi,
  layLichTrong,
  datLich,
  traCuuLich,
  huyLich,
};