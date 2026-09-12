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

  const [thongBao, setThongBao] =
    useState('');

  // Lịch đang được chọn để hoàn thành
  const [lichDangKham, setLichDangKham] =
    useState(null);

  const [formKham, setFormKham] =
    useState({
      trieuChung: '',
      chanDoan: '',
      chiTietThuoc: '',
    });

  const [dangLuu, setDangLuu] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem('user') ||
      'null'
  );

  // ==========================
  // Lấy lịch khám
  // ==========================

  async function loadLich() {
    try {
      setLoading(true);
      setError('');

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

  useEffect(() => {
    loadLich();
  }, []);

  // ==========================
  // Chọn ca khám
  // ==========================

  function moFormKham(lich) {
    setLichDangKham(lich);

    setThongBao('');

    setFormKham({
      trieuChung: '',
      chanDoan: '',
      chiTietThuoc: '',
    });
  }

  function dongFormKham() {
    setLichDangKham(null);

    setFormKham({
      trieuChung: '',
      chanDoan: '',
      chiTietThuoc: '',
    });
  }

  function handleFormChange(e) {
    const { name, value } =
      e.target;

    setFormKham((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==========================
  // Hoàn thành khám
  // ==========================

  async function handleHoanThanhKham(e) {
    e.preventDefault();

    try {
      setDangLuu(true);
      setThongBao('');

      const token =
        localStorage.getItem('token');

      if (!token) {
        throw new Error(
          'Bạn chưa đăng nhập'
        );
      }

      if (!lichDangKham) {
        throw new Error(
          'Chưa chọn lịch khám'
        );
      }

      const response = await fetch(
        `${API_URL}/bac-si/hoan-thanh-kham`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            lichKhamId:
              lichDangKham._id,

            trieuChung:
              formKham.trieuChung,

            chanDoan:
              formKham.chanDoan,

            chiTietThuoc:
              formKham.chiTietThuoc,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Không thể hoàn thành khám'
        );
      }

      setThongBao(
        'Hoàn thành khám thành công'
      );

      setLichDangKham(null);

      setFormKham({
        trieuChung: '',
        chanDoan: '',
        chiTietThuoc: '',
      });

      // Load lại để CHO_KHAM
      // chuyển thành HOAN_THANH
      await loadLich();
    } catch (error) {
      setThongBao(
        error.message
      );
    } finally {
      setDangLuu(false);
    }
  }

  // ==========================
  // Logout
  // ==========================

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  }

  return (
    <main className="simple-page">
      <section className="simple-card">

        {/* HEADER */}

        <div className="page-heading">
          <div>
            <h1>
              👨‍⚕️ Trang Bác sĩ
            </h1>

            {user && (
              <>
                <p>
                  Tài khoản:{' '}
                  <strong>
                    {user.tenDangNhap}
                  </strong>
                </p>

                <p>
                  Vai trò:{' '}
                  <strong>
                    {user.vaiTro}
                  </strong>
                </p>
              </>
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

        {/* THÔNG BÁO */}

        {thongBao && (
          <div
            className={
              thongBao ===
              'Hoàn thành khám thành công'
                ? 'message success'
                : 'message error'
            }
          >
            {thongBao}
          </div>
        )}

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

        {/* DANH SÁCH LỊCH */}

        <div className="doctor-appointments">
          {lichKham.map((lich) => (
            <div
              className="appointment doctor-appointment"
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
                  Thời gian:{' '}
                  {new Date(
                    lich.thoiGianBatDau
                  ).toLocaleString(
                    'vi-VN'
                  )}
                </p>
              </div>

              <div className="doctor-actions">
                <span
                  className={
                    `status ${lich.trangThai}`
                  }
                >
                  {lich.trangThai}
                </span>

                {lich.trangThai ===
                  'CHO_KHAM' && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      moFormKham(lich)
                    }
                  >
                    Hoàn thành khám
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FORM HOÀN THÀNH KHÁM */}

        {lichDangKham && (
          <section className="exam-form">
            <h2>
              🩺 Hoàn thành khám
            </h2>

            <div className="selected-patient">
              <strong>
                Bệnh nhân:{' '}
                {
                  lichDangKham
                    .benhNhanId?.hoTen
                }
              </strong>

              <p>
                SĐT:{' '}
                {
                  lichDangKham
                    .benhNhanId
                    ?.soDienThoai
                }
              </p>

              <p>
                Lịch khám:{' '}
                {new Date(
                  lichDangKham
                    .thoiGianBatDau
                ).toLocaleString(
                  'vi-VN'
                )}
              </p>
            </div>

            <form
              className="booking-form"
              onSubmit={
                handleHoanThanhKham
              }
            >
              <label>
                Triệu chứng

                <textarea
                  name="trieuChung"
                  value={
                    formKham.trieuChung
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Ví dụ: Ho, sốt nhẹ, đau họng..."
                  required
                />
              </label>

              <label>
                Chẩn đoán

                <textarea
                  name="chanDoan"
                  value={
                    formKham.chanDoan
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Ví dụ: Viêm họng"
                  required
                />
              </label>

              <label>
                Đơn thuốc

                <textarea
                  name="chiTietThuoc"
                  value={
                    formKham.chiTietThuoc
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Ví dụ: Paracetamol 500mg..."
                  required
                />
              </label>

              <div className="exam-buttons">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={dangLuu}
                >
                  {dangLuu
                    ? 'Đang lưu...'
                    : 'Xác nhận hoàn thành'}
                </button>

                <button
                  type="button"
                  onClick={dongFormKham}
                  disabled={dangLuu}
                >
                  Hủy thao tác
                </button>
              </div>
            </form>
          </section>
        )}
      </section>
    </main>
  );
}

export default DoctorPage;