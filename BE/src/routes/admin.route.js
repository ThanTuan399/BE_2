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

// =============================
// Lịch làm việc
// =============================

router.get(
  '/lich-lam-viec',
  authenticate,
  authorize('ADMIN'),
  adminController
    .layDanhSachLichLamViec
);

router.post(
  '/lich-lam-viec',
  authenticate,
  authorize('ADMIN'),
  adminController
    .themLichLamViec
);

router.patch(
  '/lich-lam-viec/:id',
  authenticate,
  authorize('ADMIN'),
  adminController
    .capNhatLichLamViec
);

router.patch(
  '/lich-kham/:id/huy',
  authenticate,
  authorize('ADMIN'),
  adminController.huyLichKham
);

router.get(
  '/thong-ke',
  authenticate,
  authorize('ADMIN'),
  adminController.layThongKe
);

// =============================
// Chuyên khoa
// =============================

router.get(
  '/chuyen-khoa',
  authenticate,
  authorize('ADMIN'),
  adminController
    .layDanhSachChuyenKhoa
);

router.post(
  '/chuyen-khoa',
  authenticate,
  authorize('ADMIN'),
  adminController
    .themChuyenKhoa
);

router.patch(
  '/chuyen-khoa/:id',
  authenticate,
  authorize('ADMIN'),
  adminController
    .capNhatChuyenKhoa
);

router.delete(
  '/chuyen-khoa/:id',
  authenticate,
  authorize('ADMIN'),
  adminController
    .xoaChuyenKhoa
);

module.exports = router;