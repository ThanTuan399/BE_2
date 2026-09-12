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

module.exports = router;