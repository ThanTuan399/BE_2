import { NavLink } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navClassName = ({ isActive }) => isActive ? 'app-nav-link active' : 'app-nav-link';

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink to="/" className="app-brand">
          <span className="app-brand-icon">✚</span>
          <span><strong>Phòng khám</strong><small>Quản lý lịch khám</small></span>
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
              <div className="user-chip"><span className="user-chip-avatar">{user.vaiTro === 'ADMIN' ? 'A' : 'BS'}</span><strong>{user.tenDangNhap}</strong></div>
              <button type="button" className="ghost-button" onClick={onLogout}>Đăng xuất</button>
            </>
          ) : (
            <NavLink to="/login" className="header-login-button">Đăng nhập</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
