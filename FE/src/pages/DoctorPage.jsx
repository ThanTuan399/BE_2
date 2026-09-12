import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

function DoctorPage() {
  const navigate = useNavigate();

  const [lichKham, setLichKham] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const user = JSON.parse(
    localStorage.getItem('user') ||
      'null'
  );

  useEffect(() => {
    async function loadLich() {
      try {
        const token =
          localStorage.getItem('token');

        if (!token) {
          setError(
            'Bạn cần đăng nhập bác sĩ trước'
          );

          return;
        }

        const response = await fetch(
          `${API_URL}/bac-si/lich-kham`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Không lấy được lịch'
          );
        }

        setLichKham(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadLich();
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  }

  return (
    <main className="simple-page">
      <section className="simple-card">
        <div className="page-heading">
          <div>
            <h1>
              👨‍⚕️ Trang Bác sĩ
            </h1>

            {user && (
              <p>
                Tài khoản:{' '}
                <strong>
                  {user.tenDangNhap}
                </strong>
              </p>
            )}
          </div>

          {user && (
            <button onClick={logout}>
              Đăng xuất
            </button>
          )}
        </div>

        <h2>Lịch khám của tôi</h2>

        {loading && (
          <p>Đang tải...</p>
        )}

        {error && (
          <div className="message error">
            {error}

            {!user && (
              <>
                {' '}
                <Link to="/login">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        )}

        {!loading &&
          !error &&
          lichKham.length === 0 && (
            <p>Chưa có lịch khám.</p>
          )}

        <div className="doctor-appointments">
          {lichKham.map((lich) => (
            <div
              className="appointment"
              key={lich._id}
            >
              <div>
                <strong>
                  {
                    lich.benhNhanId
                      ?.hoTen
                  }
                </strong>

                <p>
                  SĐT:{' '}
                  {
                    lich.benhNhanId
                      ?.soDienThoai
                  }
                </p>

                <p>
                  {new Date(
                    lich.thoiGianBatDau
                  ).toLocaleString(
                    'vi-VN'
                  )}
                </p>
              </div>

              <span
                className={
                  `status ${lich.trangThai}`
                }
              >
                {lich.trangThai}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default DoctorPage;