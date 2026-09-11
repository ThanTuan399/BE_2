const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const {
      tenDangNhap,
      matKhau,
    } = req.body;

    const result = await authService.login(
      tenDangNhap,
      matKhau
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};