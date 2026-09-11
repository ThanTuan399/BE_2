const mongoose = require('mongoose');

const benhNhanSchema = new mongoose.Schema(
  {
    hoTen: {
      type: String,
      required: [true, 'Họ tên bệnh nhân là bắt buộc'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    soDienThoai: {
      type: String,
      required: [true, 'Số điện thoại bệnh nhân là bắt buộc'],
      unique: true,
      trim: true,
      match: [/^0\d{9}$/, 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('BenhNhan', benhNhanSchema);
