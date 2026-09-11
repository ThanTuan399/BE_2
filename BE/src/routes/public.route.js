const express = require('express');

const publicController = require(
  '../controllers/public.controller'
);

const router = express.Router();


// Danh sách bác sĩ
router.get(
  '/danh-sach-bac-si',
  publicController.layDanhSachBacSi
);


// Đặt lịch
router.post(
  '/dat-lich',
  publicController.datLich
);


// Tra cứu bằng số điện thoại
router.get(
  '/tra-cuu/:soDienThoai',
  publicController.traCuuLich
);


// Hủy lịch
router.patch(
  '/huy-lich/:id',
  publicController.huyLich
);


module.exports = router;