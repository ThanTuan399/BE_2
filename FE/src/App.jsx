import { useState } from 'react';
import './index.css';

import PublicPage from './pages/PublicPage';

function App() {
  return <PublicPage />;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

function App() {
  const [tenDangNhap, setTenDangNhap] =
    useState('');

  const [matKhau, setMatKhau] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [ketQua, setKetQua] =
    useState(null);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setKetQua(null);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            tenDangNhap,
            matKhau,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Đăng nhập thất bại'
        );
      }

      localStorage.setItem(
        'token',
        data.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.data.user)
      );

      setKetQua({
        thanhCong: true,
        data,
      });
    } catch (error) {
      setKetQua({
        thanhCong: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setKetQua(null);
    setTenDangNhap('');
    setMatKhau('');
  }

  return (
    <main className="page">
      <div className="login-card">
        <h1>Phòng khám</h1>

        <p className="subtitle">
          Kiểm tra chức năng xác thực
        </p>

        <form onSubmit={handleLogin}>
          <label>
            Tên đăng nhập

            <input
              value={tenDangNhap}
              onChange={(e) =>
                setTenDangNhap(e.target.value)
              }
              placeholder="admin"
            />
          </label>

          <label>
            Mật khẩu

            <input
              type="password"
              value={matKhau}
              onChange={(e) =>
                setMatKhau(e.target.value)
              }
              placeholder="Nhập mật khẩu"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Đang đăng nhập...'
              : 'Đăng nhập'}
          </button>
        </form>

        {ketQua?.thanhCong && (
          <div className="success">
            <h2>Đăng nhập thành công</h2>

            <p>
              Vai trò:{' '}
              <strong>
                {
                  ketQua.data.data.user
                    .vaiTro
                }
              </strong>
            </p>

            <p>
              Username:{' '}
              {
                ketQua.data.data.user
                  .tenDangNhap
              }
            </p>

            {ketQua.data.data.user
              .bacSiId && (
              <p>
                Bác sĩ ID:{' '}
                {
                  ketQua.data.data.user
                    .bacSiId
                }
              </p>
            )}

            <details>
              <summary>Xem JWT</summary>

              <pre>
                {
                  ketQua.data.data
                    .token
                }
              </pre>
            </details>

            <button
              className="logout"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}

        {ketQua &&
          !ketQua.thanhCong && (
            <div className="error">
              {ketQua.message}
            </div>
          )}
      </div>
    </main>
  );
}

export default App;