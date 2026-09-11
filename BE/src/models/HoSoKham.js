const mongoose = require('mongoose');

const HoSoKhamSchema = new mongoose.Schema({
  lichKhamId: { type: mongoose.Schema.Types.ObjectId, ref: 'LichKham', required: true, unique: true },
  trieuChung: { type: String, required: true },
  chanDoan: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('HoSoKham', HoSoKhamSchema);