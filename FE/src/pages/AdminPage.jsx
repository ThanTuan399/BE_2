import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

function AdminPage() {
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

  // ==========================
  // Load toàn bộ lịch
  // ==========================

  useEffect(() => {
    async function loadLichKham() {
      try {
        setLoading(true);
        setError('');

        const token =
          localStorage.getItem(
            'token'
          );

        if (!token) {
          throw new Error(
            'Bạn cần đăng nhập ADMIN'
          );
        }

        const response =
          await fetch(
            `${API_URL}/admin/lich-kham`,
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
              'Không lấy được lịch khám'
          );
        }

        setLichKham(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadLichKham();
  }, []);

  // ==========================
  // Logout
  // ==========================

  function logout() {
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    navigate('/login');
  }

  // ==========================
  // Thống kê tạm từ danh sách
  // ==========================

  const tongLich =
    lichKham.length;

  const choKham =
    lichKham.filter(
      (lich) =>
        lich.trangThai ===
        'CHO_KHAM'
    ).length;

  const hoanThanh =
    lichKham.filter(
      (lich) =>
        lich.trangThai ===
        'HOAN_THANH'
    ).length;

  const daHuy =
    lichKham.filter(
      (lich) =>
        lich.trangThai ===
        'DA_HUY'
    ).length;

  function hienThiTrangThai(
    trangThai
  ) {
    if (
      trangThai === 'CHO_KHAM'
    ) {
      return 'Chờ khám';
    }

    if (
      trangThai ===
      'HOAN_THANH'
    ) {
      return 'Hoàn thành';
    }

    if (
      trangThai === 'DA_HUY'
    ) {
      return 'Đã hủy';
    }

    return trangThai;
  }

  return (
    <main className="simple-page">
      <section className="simple-card">

        {/* HEADER */}

        <div className="page-heading">
          <div>
            <h1>
              ⚙️ Trang Admin
            </h1>

            {user && (
              <p>
                Tài khoản:{' '}
                <strong>
                  {
                    user
                      .tenDangNhap
                  }
                </strong>
              </p>
            )}
          </div>

          {user && (
            <button
              type="button"
              onClick={logout}
            >
              Đăng xuất
            </button>
          )}
        </div>

        {loading && (
          <p>
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {!loading &&
          !error && (
          <>
            {/* THỐNG KÊ */}

            <section className="admin-stat-grid">
              <div className="admin-stat-card">
                <span>
                  Tổng lịch
                </span>

                <strong>
                  {tongLich}
                </strong>
              </div>

              <div className="admin-stat-card">
                <span>
                  Chờ khám
                </span>

                <strong>
                  {choKham}
                </strong>
              </div>

              <div className="admin-stat-card">
                <span>
                  Hoàn thành
                </span>

                <strong>
                  {hoanThanh}
                </strong>
              </div>

              <div className="admin-stat-card">
                <span>
                  Đã hủy
                </span>

                <strong>
                  {daHuy}
                </strong>
              </div>
            </section>

            {/* DANH SÁCH */}

            <section className="admin-section">
              <h2>
                📅 Toàn bộ lịch khám
              </h2>

              {lichKham.length ===
              0 ? (
                <p>
                  Chưa có lịch khám.
                </p>
              ) : (
                <div className="admin-appointments">
                  {lichKham.map(
                    (lich) => (
                      <article
                        className="admin-appointment"
                        key={
                          lich._id
                        }
                      >
                        <div>
                          <h3>
                            {
                              lich
                                .benhNhanId
                                ?.hoTen
                            }
                          </h3>

                          <p>
                            SĐT bệnh nhân:{' '}
                            {
                              lich
                                .benhNhanId
                                ?.soDienThoai
                            }
                          </p>

                          <p>
                            Bác sĩ:{' '}
                            <strong>
                              {
                                lich
                                  .bacSiId
                                  ?.hoTen
                              }
                            </strong>
                          </p>

                          <p>
                            Thời gian:{' '}
                            {new Date(
                              lich
                                .thoiGianBatDau
                            )
                              .toLocaleString(
                                'vi-VN'
                              )}
                          </p>
                        </div>

                        <span
                          className={
                            `status ${lich.trangThai}`
                          }
                        >
                          {
                            hienThiTrangThai(
                              lich
                                .trangThai
                            )
                          }
                        </span>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminPage;