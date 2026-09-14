import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="page-container home-simple-page">
      <section className="home-simple-card">
        <h1>Hệ thống quản lý phòng khám</h1>
        <p>Đặt lịch khám, tra cứu hồ sơ và quản lý lịch khám.</p>

        <div className="home-actions">
          <Link to="/public" className="primary-link-button">Đặt lịch khám</Link>
          <Link to="/ho-so-benh-nhan" className="secondary-link-button">Tra cứu hồ sơ</Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
