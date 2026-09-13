const express = require('express');

const doctorController = require(
  '../controllers/doctor.controller'
);

const authenticate = require(
  '../middleware/authenticate'
);

const authorize = require(
  '../middleware/authorize'
);

const router = express.Router();

router.get(
  '/lich-kham',
  authenticate,
  authorize('BAC_SI'),
  doctorController.layLichKham
);

router.post(
  '/hoan-thanh-kham',
  authenticate,
  authorize('BAC_SI'),
  doctorController.hoanThanhKham
);

router.get(
  '/thong-tin',
  authenticate,
  authorize('BAC_SI'),
  doctorController.layThongTin
);

module.exports = router;