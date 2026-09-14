import { Link } from 'react-router-dom';

const tinhNang = [
  { icon: '📅', title: 'Đặt lịch chủ động', text: 'Xem lịch trống 7 ngày tới và chọn đúng khung giờ bác sĩ còn nhận khám.' },
  { icon: '🩺', title: 'Theo dõi hồ sơ khám', text: 'Tra cứu lịch sử khám, chẩn đoán và đơn thuốc theo số điện thoại.' },
  { icon: '👨‍⚕️', title: 'Không gian dành cho bác sĩ', text: 'Bác sĩ xem lịch riêng, hoàn thành khám và kê đơn ngay trên hệ thống.' },
  { icon: '📊', title: 'Quản trị tập trung', text: 'Admin quản lý bác sĩ, chuyên khoa, ca làm việc, lịch khám và thống kê.' },
];

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">HỆ THỐNG QUẢN LÝ PHÒNG KHÁM</span>
          <h1>Đặt lịch dễ hơn, quản lý khám rõ ràng hơn.</h1>
          <p>Hệ thống kết nối bệnh nhân, bác sĩ và quản trị viên trong một quy trình thống nhất: xem lịch trống, đặt lịch, khám bệnh, kê đơn và theo dõi lịch sử.</p>

          <div className="hero-actions">
            <Link to="/public" className="primary-link-button">Đặt lịch khám</Link>
            <Link to="/ho-so-benh-nhan" className="secondary-link-button">Tra cứu hồ sơ</Link>
          </div>

          <div className="hero-trust-row">
            <span>✓ Lịch khám 30 phút</span>
            <span>✓ Kiểm tra trùng lịch</span>
            <span>✓ Theo dõi trạng thái khám</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-top">
            <span className="hero-panel-badge">Lịch khám hôm nay</span>
            <strong>Phòng khám</strong>
          </div>
          <div className="hero-mini-card">
            <span className="hero-time">08:30</span>
            <div><strong>Khám Nội khoa</strong><small>Đang chờ khám</small></div>
          </div>
          <div className="hero-mini-card">
            <span className="hero-time">10:00</span>
            <div><strong>Khám Nhi khoa</strong><small>Khung giờ còn trống</small></div>
          </div>
          <div className="hero-mini-card muted">
            <span className="hero-time">13:30</span>
            <div><strong>Ca chiều</strong><small>Sẵn sàng nhận lịch</small></div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span className="eyebrow">CHỨC NĂNG CHÍNH</span>
          <h2>Một hệ thống cho toàn bộ quy trình khám</h2>
          <p>Giao diện được chia theo đúng vai trò để mỗi người chỉ thấy những gì mình cần.</p>
        </div>

        <div className="feature-grid">
          {tinhNang.map((item) => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="eyebrow">BẮT ĐẦU NGAY</span>
          <h2>Bạn muốn đặt lịch hay đăng nhập nội bộ?</h2>
          <p>Bệnh nhân không cần tạo tài khoản. Bác sĩ và Admin sử dụng tài khoản nội bộ để truy cập khu vực riêng.</p>
        </div>
        <div className="hero-actions">
          <Link to="/public" className="primary-link-button">Dành cho bệnh nhân</Link>
          <Link to="/login" className="secondary-link-button">Đăng nhập nội bộ</Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
