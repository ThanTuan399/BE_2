const mongoose = require('mongoose');

const lichKhamSchema = new mongoose.Schema(
  {
    bacSiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BacSi',
      required: true,
      index: true,
    },
    benhNhanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BenhNhan',
      required: true,
      index: true,
    },
    thoiGianBatDau: {
      type: Date,
      required: true,
      index: true,
    },
    thoiGianKetThuc: {
      type: Date,
      required: true,
    },
    trangThai: {
      type: String,
      enum: ['CHO_KHAM', 'HOAN_THANH', 'DA_HUY'],
      default: 'CHO_KHAM',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

lichKhamSchema.pre('validate', function validateAppointmentTime(next) {
  if (this.thoiGianBatDau && this.thoiGianKetThuc && this.thoiGianBatDau >= this.thoiGianKetThuc) {
    return next(new Error('thoiGianBatDau phải nhỏ hơn thoiGianKetThuc'));
  }

  next();
});

// Khóa các chuyển trạng thái không hợp lệ theo thời gian thực tế.
lichKhamSchema.pre('save', function validateStatusTransition(next) {
  if (this.isNew || !this.isModified('trangThai')) {
    return next();
  }

  const hienTai = new Date();

  if (this.trangThai === 'HOAN_THANH' && this.thoiGianBatDau > hienTai) {
    const error = new Error('Chưa đến thời gian khám nên không thể hoàn thành lịch');
    error.statusCode = 409;
    return next(error);
  }

  if (this.trangThai === 'DA_HUY' && this.thoiGianBatDau <= hienTai) {
    const error = new Error('Không thể hủy lịch đã đến hoặc qua thời gian khám');
    error.statusCode = 409;
    return next(error);
  }

  next();
});

// Tối ưu truy vấn kiểm tra trùng lịch theo bác sĩ và thời gian.
lichKhamSchema.index({ bacSiId: 1, thoiGianBatDau: 1, thoiGianKetThuc: 1 });

module.exports = mongoose.model('LichKham', lichKhamSchema);
