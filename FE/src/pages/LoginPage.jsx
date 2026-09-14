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
      <section className="auth-card-simple">
        <h1>Đăng nhập phòng khám</h1>

        <form className="auth-form-simple" onSubmit={handleLogin}>
          <label>
            Tên đăng nhập
            <input value={tenDangNhap} onChange={(e) => setTenDangNhap(e.target.value)} placeholder="Nhập tên đăng nhập" autoComplete="username" required />
          </label>

          <label>
            Mật khẩu
            <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" required />
          </label>

          <button className="primary-button" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          {error && <div className="message error">{error}</div>}
        </form>

        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
      </section>
    </main>
  );
}

export default LoginPage;
