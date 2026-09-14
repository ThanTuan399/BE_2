import { Link } from 'react-router-dom';

function HomeView() {
  return (
    <main className="page-container home-view">
      <section className="home-box">
        <h1>Phòng khám</h1>
        <p>Hệ thống hỗ trợ đặt lịch khám, tra cứu hồ sơ và quản lý lịch khám.</p>

        <div className="home-actions">
          <Link to="/public" className="primary-link-button">Đặt lịch khám</Link>
          <Link to="/ho-so-benh-nhan" className="secondary-link-button">Tra cứu hồ sơ</Link>
        </div>
      </section>
    </main>
  );
}

export default HomeView;
