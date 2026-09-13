const doctorService = require(
  '../services/doctor.service'
);

async function layLichKham(req, res, next) {
  try {
    const bacSiId = req.user.bacSiId;

    const data =
      await doctorService.layLichKhamCuaBacSi(
        bacSiId
      );

    return res.status(200).json({
      success: true,
      message:
        'Lấy lịch khám của bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function hoanThanhKham(
  req,
  res,
  next
) {
  try {
    const bacSiId =
      req.user.bacSiId;

    const data =
      await doctorService.hoanThanhKham(
        bacSiId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        'Hoàn thành khám thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function layThongTin(
  req,
  res,
  next
) {
  try {
    const data =
      await doctorService
        .layThongTinBacSi(
          req.user.bacSiId
        );

    return res.status(200).json({
      success: true,
      message:
        'Lấy thông tin bác sĩ thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  layThongTin,
  layLichKham,
  hoanThanhKham,
};