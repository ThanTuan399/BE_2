import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function layNguoiDung() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function AppShell() {
  const navigate = useNavigate();
  const user = layNguoiDung();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const navClassName = ({ isActive }) => isActive ? 'app-nav-link active' : 'app-nav-link';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/" className="app-brand">
            <span className="app-brand-icon">+</span>
            <span>
              <strong>Phòng khám</strong>
              <small>Quản lý lịch khám</small>
            </span>
          </NavLink>

          <nav className="app-nav" aria-label="Điều hướng chính">
            <NavLink to="/" end className={navClassName}>Trang chủ</NavLink>
            <NavLink to="/public" className={navClassName}>Đặt lịch</NavLink>
            <NavLink to="/ho-so-benh-nhan" className={navClassName}>Hồ sơ bệnh nhân</NavLink>
            {user?.vaiTro === 'BAC_SI' && <NavLink to="/bac-si" className={navClassName}>Bác sĩ</NavLink>}
            {user?.vaiTro === 'ADMIN' && <NavLink to="/admin" className={navClassName}>Admin</NavLink>}
          </nav>

          <div className="app-header-actions">
            {user ? (
              <>
                <span className="header-user-name">{user.tenDangNhap}</span>
                <button type="button" className="ghost-button" onClick={logout}>Đăng xuất</button>
              </>
            ) : (
              <NavLink to="/login" className="header-login-button">Đăng nhập</NavLink>
            )}
          </div>
        </div>
      </header>

      <div className="app-content">
        <Outlet />
      </div>

      <footer className="app-footer">
        <div>Hệ thống quản lý phòng khám</div>
      </footer>
    </div>
  );
}

export default AppShell;
