import { Link } from 'react-router-dom';

function LoginView({ tenDangNhap, setTenDangNhap, matKhau, setMatKhau, loading, error, handleLogin }) {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Đăng nhập phòng khám</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            Tên đăng nhập
            <input value={tenDangNhap} onChange={(e) => setTenDangNhap(e.target.value)} autoComplete="username" required />
          </label>

          <label>
            Mật khẩu
            <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} autoComplete="current-password" required />
          </label>

          <button className="primary-button" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          {error && <div className="message error">{error}</div>}
        </form>

        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
      </section>
    </main>
  );
}

export default LoginView;
