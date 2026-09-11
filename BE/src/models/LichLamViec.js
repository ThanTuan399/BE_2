const mongoose = require('mongoose');

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const lichLamViecSchema = new mongoose.Schema(
  {
    bacSiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BacSi',
      required: true,
      index: true,
    },

    // Quy ước ISO:
    // 1 = Thứ 2
    // 2 = Thứ 3
    // ...
    // 7 = Chủ nhật
    thuTrongTuan: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
      index: true,
    },

    gioBatDau: {
      type: String,
      required: true,
      match: [HH_MM_REGEX, 'Giờ bắt đầu phải có dạng HH:mm'],
    },

    gioKetThuc: {
      type: String,
      required: true,
      match: [HH_MM_REGEX, 'Giờ kết thúc phải có dạng HH:mm'],
    },

    dangHoatDong: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Kiểm tra khoảng thời gian hợp lệ.
lichLamViecSchema.pre('validate', function () {
  if (
    this.gioBatDau &&
    this.gioKetThuc &&
    this.gioBatDau >= this.gioKetThuc
  ) {
    throw new Error('gioBatDau phải nhỏ hơn gioKetThuc');
  }
});

// Index phục vụ tìm lịch làm việc của bác sĩ.
lichLamViecSchema.index({
  bacSiId: 1,
  thuTrongTuan: 1,
  dangHoatDong: 1,
  gioBatDau: 1,
  gioKetThuc: 1,
});

module.exports = mongoose.model(
  'LichLamViec',
  lichLamViecSchema
);