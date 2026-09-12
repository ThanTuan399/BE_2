import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

function LoginPage() {
  const navigate = useNavigate();

  const [tenDangNhap, setTenDangNhap] =
    useState('');

  const [matKhau, setMatKhau] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            tenDangNhap,
            matKhau,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem(
        'token',
        data.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.data.user)
      );

      if (
        data.data.user.vaiTro ===
        'BAC_SI'
      ) {
        navigate('/bac-si');
        return;
      }

      if (
        data.data.user.vaiTro ===
        'ADMIN'
      ) {
        navigate('/admin');
      }
    } catch (error) {
      setError(
        error.message ||
          'Đăng nhập thất bại'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="simple-page">
      <section className="simple-card login-box">
        <h1>Đăng nhập nội bộ</h1>

        <p>
          Dành cho Bác sĩ và Admin
        </p>

        <form
          className="booking-form"
          onSubmit={handleLogin}
        >
          <label>
            Tên đăng nhập

            <input
              value={tenDangNhap}
              onChange={(e) =>
                setTenDangNhap(
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Mật khẩu

            <input
              type="password"
              value={matKhau}
              onChange={(e) =>
                setMatKhau(
                  e.target.value
                )
              }
              required
            />
          </label>

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Đang đăng nhập...'
              : 'Đăng nhập'}
          </button>
        </form>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}

export default LoginPage;