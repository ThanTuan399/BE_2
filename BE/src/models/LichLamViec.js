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
    // Quy ước ISO: 1 = Thứ 2, ..., 7 = Chủ nhật.
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

lichLamViecSchema.pre('validate', function validateWorkingHours(next) {
  if (this.gioBatDau && this.gioKetThuc && this.gioBatDau >= this.gioKetThuc) {
    return next(new Error('gioBatDau phải nhỏ hơn gioKetThuc'));
  }
  next();
});

// Không cho một bác sĩ có hai ca làm việc trùng hoàn toàn cùng thứ.
lichLamViecSchema.index(
  { bacSiId: 1, thuTrongTuan: 1, gioBatDau: 1, gioKetThuc: 1 },
  { unique: true }
);

module.exports = mongoose.model('LichLamViec', lichLamViecSchema);
