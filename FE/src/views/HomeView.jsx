import { Link } from 'react-router-dom';

function HomeView() {
  return (
    <main className="page-container home-view">
      <section className="home-main">
        <div className="home-intro">
          <span className="home-label">HỆ THỐNG QUẢN LÝ PHÒNG KHÁM</span>
          <h1>Phòng khám</h1>
          <p>Hỗ trợ bệnh nhân đặt lịch, xem lịch trống của bác sĩ và tra cứu hồ sơ khám.</p>

          <div className="home-actions">
            <Link to="/public" className="primary-link-button">Đặt lịch khám</Link>
            <Link to="/ho-so-benh-nhan" className="secondary-link-button">Tra cứu hồ sơ</Link>
          </div>
        </div>

        <div className="home-booking-guide">
          <h2>Đặt lịch khám</h2>
          <div className="home-step"><span>1</span><div><strong>Chọn bác sĩ</strong><p>Xem tên và chuyên khoa của bác sĩ.</p></div></div>
          <div className="home-step"><span>2</span><div><strong>Chọn lịch trống</strong><p>Chọn ngày và khung giờ trong 7 ngày tới.</p></div></div>
          <div className="home-step"><span>3</span><div><strong>Xác nhận đặt lịch</strong><p>Nhập họ tên, số điện thoại và gửi yêu cầu.</p></div></div>
        </div>
      </section>

      <section className="home-functions">
        <h2>Chức năng chính</h2>

        <div className="home-function-grid">
          <article className="home-function-card">
            <div className="home-function-number">01</div>
            <h3>Đặt lịch khám</h3>
            <p>Xem bác sĩ, chuyên khoa và những khung giờ còn trống trước khi đặt lịch.</p>
            <Link to="/public">Đi đến đặt lịch →</Link>
          </article>

          <article className="home-function-card">
            <div className="home-function-number">02</div>
            <h3>Hồ sơ bệnh nhân</h3>
            <p>Tra cứu lịch sử khám, kết quả khám và đơn thuốc bằng số điện thoại.</p>
            <Link to="/ho-so-benh-nhan">Xem hồ sơ →</Link>
          </article>

          <article className="home-function-card">
            <div className="home-function-number">03</div>
            <h3>Khu vực nội bộ</h3>
            <p>Bác sĩ và quản trị viên đăng nhập để sử dụng các chức năng quản lý.</p>
            <Link to="/login">Đăng nhập →</Link>
          </article>
        </div>
      </section>

      <section className="home-note">
        <strong>Dành cho bệnh nhân:</strong>
        <span> Không cần tạo tài khoản khi đặt lịch hoặc tra cứu hồ sơ.</span>
      </section>
    </main>
  );
}

export default HomeView;
