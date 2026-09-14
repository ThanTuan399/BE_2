const mongoose = require('mongoose');
const LichKham = require('./LichKham');

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_ZONE = 'Asia/Ho_Chi_Minh';

function layThongTinGioVietNam(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const data = {};
  for (const part of parts) data[part.type] = part.value;

  const mapThu = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return { thuTrongTuan: mapThu[data.weekday], gio: `${data.hour}:${data.minute}` };
}

const lichLamViecSchema = new mongoose.Schema(
  {
    bacSiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BacSi',
      required: true,
      index: true,
    },

    // Quy ước ISO: 1 = Thứ 2 ... 7 = Chủ nhật.
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
lichLamViecSchema.pre('validate', function validateWorkingHours(next) {
  if (this.gioBatDau && this.gioKetThuc && this.gioBatDau >= this.gioKetThuc) {
    return next(new Error('gioBatDau phải nhỏ hơn gioKetThuc'));
  }

  next();
});

// Không cho sửa hoặc tắt một ca đang còn lịch CHO_KHAM chưa kết thúc.
lichLamViecSchema.pre('save', async function protectBookedAppointments(next) {
  try {
    if (this.isNew) return next();

    const truongCanKiemTra = ['bacSiId', 'thuTrongTuan', 'gioBatDau', 'gioKetThuc', 'dangHoatDong'];
    if (!truongCanKiemTra.some((field) => this.isModified(field))) return next();

    const lichCu = await this.constructor.findById(this._id).lean();
    if (!lichCu || !lichCu.dangHoatDong) return next();

    const lichChoKham = await LichKham.find({
      bacSiId: lichCu.bacSiId,
      trangThai: 'CHO_KHAM',
      thoiGianKetThuc: { $gt: new Date() },
    }).select('thoiGianBatDau thoiGianKetThuc').lean();

    const coLichBiAnhHuong = lichChoKham.some((lich) => {
      const batDau = layThongTinGioVietNam(lich.thoiGianBatDau);
      const ketThuc = layThongTinGioVietNam(lich.thoiGianKetThuc);

      return batDau.thuTrongTuan === lichCu.thuTrongTuan && batDau.gio >= lichCu.gioBatDau && ketThuc.gio <= lichCu.gioKetThuc;
    });

    if (coLichBiAnhHuong) {
      const error = new Error('Không thể sửa hoặc tắt ca làm việc vì đang có lịch khám chờ xử lý');
      error.statusCode = 409;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Index phục vụ tìm lịch làm việc của bác sĩ.
lichLamViecSchema.index({ bacSiId: 1, thuTrongTuan: 1, dangHoatDong: 1, gioBatDau: 1, gioKetThuc: 1 });

module.exports = mongoose.model('LichLamViec', lichLamViecSchema);
