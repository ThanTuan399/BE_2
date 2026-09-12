import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>Hệ thống Phòng khám</h1>

        <p>
          Trang điều hướng chức năng và kiểm thử hệ thống
        </p>
      </section>

      <section className="feature-grid">
        <Link
          to="/public"
          className="feature-card"
        >
          <div className="feature-icon">
            👤
          </div>

          <h2>Bệnh nhân</h2>

          <p>
            Chức năng công khai, không cần đăng nhập.
          </p>

          <div className="feature-status">
            <span>✓ Danh sách bác sĩ</span>
            <span>✓ Đặt lịch khám</span>
            <span>✓ Tra cứu lịch</span>
            <span>✓ Hủy lịch</span>
          </div>

          <strong>
            Mở trang bệnh nhân →
          </strong>
        </Link>

        <Link
          to="/login"
          className="feature-card"
        >
          <div className="feature-icon">
            🔐
          </div>

          <h2>Xác thực</h2>

          <p>
            Đăng nhập tài khoản nội bộ.
          </p>

          <div className="feature-status">
            <span>✓ ADMIN</span>
            <span>✓ BAC_SI</span>
            <span>✓ JWT</span>
            <span>✓ Phân quyền</span>
          </div>

          <strong>
            Đăng nhập →
          </strong>
        </Link>

        <Link
          to="/bac-si"
          className="feature-card"
        >
          <div className="feature-icon">
            👨‍⚕️
          </div>

          <h2>Bác sĩ</h2>

          <p>
            Chức năng nội bộ dành cho bác sĩ.
          </p>

          <div className="feature-status">
            <span>◉ Xem lịch khám</span>
            <span>○ Hoàn thành khám</span>
            <span>○ Hồ sơ khám</span>
            <span>○ Kê đơn</span>
          </div>

          <strong>
            Mở trang bác sĩ →
          </strong>
        </Link>

        <Link
          to="/admin"
          className="feature-card"
        >
          <div className="feature-icon">
            ⚙️
          </div>

          <h2>Admin</h2>

          <p>
            Quản trị và điều phối hệ thống.
          </p>

          <div className="feature-status">
            <span>○ Quản lý bác sĩ</span>
            <span>○ Lịch làm việc</span>
            <span>○ Điều phối lịch</span>
            <span>○ Thống kê</span>
          </div>

          <strong>
            Mở trang Admin →
          </strong>
        </Link>
      </section>
    </main>
  );
}

export default HomePage;