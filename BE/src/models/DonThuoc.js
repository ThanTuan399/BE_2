const mongoose = require('mongoose');

const DonThuocSchema = new mongoose.Schema({
  hoSoKhamId: { type: mongoose.Schema.Types.ObjectId, ref: 'HoSoKham', required: true },
  chiTietThuoc: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DonThuoc', DonThuocSchema);