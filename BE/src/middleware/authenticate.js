const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập',
      });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
    });
  }
}

module.exports = authenticate;