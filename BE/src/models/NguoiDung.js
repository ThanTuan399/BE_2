const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema(
  {
    tenDangNhap: {
      type: String,
      required: [true, 'Tên đăng nhập là bắt buộc'],
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 50,
      lowercase: true,
      index: true,
    },
    matKhau: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: 60,
      select: false,
    },
    vaiTro: {
      type: String,
      enum: ['ADMIN', 'BAC_SI'],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('NguoiDung', nguoiDungSchema);
