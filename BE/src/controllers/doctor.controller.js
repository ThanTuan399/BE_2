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

module.exports = {
  layLichKham,
};