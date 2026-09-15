const adminDoctorService = require('../services/admin-doctor.service');

async function xoaBacSi(req, res, next) {
  try {
    const data = await adminDoctorService.xoaBacSi(req.params.id);
    return res.status(200).json({ success: true, message: 'Xóa bác sĩ thành công', data });
  } catch (error) {
    next(error);
  }
}

module.exports = { xoaBacSi };
