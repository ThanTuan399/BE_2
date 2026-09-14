import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');
      if (!token || !user) return;
      navigate(user.vaiTro === 'ADMIN' ? '/admin' : '/bac-si', { replace: true });
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap, matKhau }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      const macDinh = data.data.user.vaiTro === 'ADMIN' ? '/admin' : '/bac-si';
      const dich = location.state?.from || macDinh;
      navigate(dich, { replace: true });
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">KHU VỰC NỘI BỘ</span>
          <h1>Đăng nhập hệ thống</h1>
          <p>Dành cho bác sĩ và quản trị viên của phòng khám.</p>

          <div className="auth-note">
            <strong>Quyền truy cập được phân theo vai trò</strong>
            <span>Bác sĩ xem lịch của mình và hoàn thành khám.</span>
            <span>Admin quản lý vận hành và thống kê hệ thống.</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Tên đăng nhập
            <input value={tenDangNhap} onChange={(e) => setTenDangNhap(e.target.value)} placeholder="Nhập tên đăng nhập" autoComplete="username" required />
          </label>

          <label>
            Mật khẩu
            <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" required />
          </label>

          <button className="primary-button auth-submit" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          {error && <div className="message error">{error}</div>}
          <Link to="/" className="back-link">← Quay lại trang chủ</Link>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
