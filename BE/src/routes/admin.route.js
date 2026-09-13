const express = require('express');

const adminController =
  require(
    '../controllers/admin.controller'
  );

const authenticate =
  require(
    '../middleware/authenticate'
  );

const authorize =
  require(
    '../middleware/authorize'
  );

const router = express.Router();


// =============================
// Lịch khám
// =============================

router.get(
  '/lich-kham',
  authenticate,
  authorize('ADMIN'),
  adminController.layTatCaLichKham
);


// =============================
// Bệnh nhân
// =============================

router.get(
  '/benh-nhan',
  authenticate,
  authorize('ADMIN'),
  adminController.layDanhSachBenhNhan
);


// =============================
// Bác sĩ
// =============================

router.get(
  '/bac-si',
  authenticate,
  authorize('ADMIN'),
  adminController.layDanhSachBacSi
);

router.post(
  '/bac-si',
  authenticate,
  authorize('ADMIN'),
  adminController.themBacSi
);

router.patch(
  '/bac-si/:id',
  authenticate,
  authorize('ADMIN'),
  adminController.capNhatBacSi
);


module.exports = router;