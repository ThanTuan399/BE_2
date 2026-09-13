const mongoose = require('mongoose');

const chuyenKhoaSchema =
  new mongoose.Schema(
    {
      tenChuyenKhoa: {
        type: String,
        required: [
          true,
          'Tên chuyên khoa là bắt buộc',
        ],
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

module.exports =
  mongoose.model(
    'ChuyenKhoa',
    chuyenKhoaSchema
  );