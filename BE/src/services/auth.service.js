const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NguoiDung = require('../models/NguoiDung');
const BacSi = require('../models/BacSi');

async function login(tenDangNhap, matKhau) {
  // 1. Kiểm tra input
  if (
    typeof tenDangNhap !== 'string' ||
    typeof matKhau !== 'string' ||
    !tenDangNhap.trim() ||
    !matKhau
  ) {
    const error = new Error(
      'Tên đăng nhập và mật khẩu là bắt buộc'
    );
    error.statusCode = 400;
    throw error;
  }

  const tenDangNhapChuanHoa = tenDangNhap
    .trim()
    .toLowerCase();

  const nguoiDung = await NguoiDung.findOne({
    tenDangNhap: tenDangNhapChuanHoa,
  }).select('+matKhau');

  if (!nguoiDung) {
    const error = new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    error.statusCode = 401;
    throw error;
  }

  // 3. So sánh mật khẩu
  const matKhauDung = await bcrypt.compare(
    matKhau,
    nguoiDung.matKhau
  );

  if (!matKhauDung) {
    const error = new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    error.statusCode = 401;
    throw error;
  }

  // 4. Nếu là bác sĩ thì tìm hồ sơ BacSi
  let bacSiId = null;

  if (nguoiDung.vaiTro === 'BAC_SI') {
    const bacSi = await BacSi.findOne({
      nguoiDungId: nguoiDung._id,
    });

    if (!bacSi) {
      const error = new Error(
        'Tài khoản bác sĩ chưa có hồ sơ bác sĩ'
      );
      error.statusCode = 403;
      throw error;
    }

    bacSiId = bacSi._id;
  }

  // 5. Payload JWT
  const payload = {
    userId: nguoiDung._id.toString(),
    vaiTro: nguoiDung.vaiTro,
  };

  if (bacSiId) {
    payload.bacSiId = bacSiId.toString();
  }

  // 6. Tạo token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );

  // 7. Trả kết quả
  return {
    token,
    user: {
      id: nguoiDung._id,
      tenDangNhap: nguoiDung.tenDangNhap,
      vaiTro: nguoiDung.vaiTro,
      bacSiId,
    },
  };
}

module.exports = {
  login,
};