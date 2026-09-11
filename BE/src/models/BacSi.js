const mongoose = require('mongoose');

const bacSiSchema = new mongoose.Schema(
  {
    nguoiDungId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NguoiDung',
      required: true,
      unique: true,
      index: true,
    },
    hoTen: {
      type: String,
      required: [true, 'Họ tên bác sĩ là bắt buộc'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    soDienThoai: {
      type: String,
      required: [true, 'Số điện thoại bác sĩ là bắt buộc'],
      trim: true,
      match: [/^0\d{9}$/, 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('BacSi', bacSiSchema);
