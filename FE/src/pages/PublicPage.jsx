import { useEffect, useState } from 'react';

import {
  layDanhSachBacSi,
  datLich,
  traCuuLich,
  huyLich,
} from '../api/publicApi';

function PublicPage() {
  const [danhSachBacSi, setDanhSachBacSi] =
    useState([]);

  const [loadingBacSi, setLoadingBacSi] =
    useState(true);

  const [form, setForm] = useState({
    hoTen: '',
    soDienThoai: '',
    bacSiId: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  const [thongBaoDatLich, setThongBaoDatLich] =
    useState(null);

  const [soDienThoaiTraCuu, setSoDienThoaiTraCuu] =
    useState('');

  const [ketQuaTraCuu, setKetQuaTraCuu] =
    useState(null);

  const [loadingDatLich, setLoadingDatLich] =
    useState(false);

  const [loadingTraCuu, setLoadingTraCuu] =
    useState(false);


  // ==========================
  // Load bác sĩ
  // ==========================

  useEffect(() => {
    async function loadBacSi() {
      try {
        const result =
          await layDanhSachBacSi();

        setDanhSachBacSi(result.data);

        if (result.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            bacSiId: result.data[0]._id,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingBacSi(false);
      }
    }

    loadBacSi();
  }, []);


  // ==========================
  // Form
  // ==========================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  // ==========================
  // Đặt lịch
  // ==========================

  async function handleDatLich(e) {
    e.preventDefault();

    try {
      setLoadingDatLich(true);
      setThongBaoDatLich(null);

      const payload = {
        ...form,

        thoiGianBatDau: new Date(
          form.thoiGianBatDau
        ).toISOString(),

        thoiGianKetThuc: new Date(
          form.thoiGianKetThuc
        ).toISOString(),
      };

      const result = await datLich(payload);

      setThongBaoDatLich({
        type: 'success',
        message: result.message,
      });

      setSoDienThoaiTraCuu(
        form.soDienThoai
      );

      setForm((prev) => ({
        ...prev,
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
      }));
    } catch (error) {
      setThongBaoDatLich({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoadingDatLich(false);
    }
  }


  // ==========================
  // Tra cứu
  // ==========================

  async function handleTraCuu(e) {
    e?.preventDefault();

    if (!soDienThoaiTraCuu) {
      return;
    }

    try {
      setLoadingTraCuu(true);

      const result =
        await traCuuLich(
          soDienThoaiTraCuu
        );

      setKetQuaTraCuu(result.data);
    } catch (error) {
      setKetQuaTraCuu({
        error: error.message,
      });
    } finally {
      setLoadingTraCuu(false);
    }
  }


  // ==========================
  // Hủy lịch
  // ==========================

  async function handleHuyLich(id) {
    const dongY = window.confirm(
      'Bạn có chắc muốn hủy lịch khám này?'
    );

    if (!dongY) {
      return;
    }

    try {
      await huyLich(
        id,
        soDienThoaiTraCuu
      );

      // Load lại lịch sau khi hủy
      await handleTraCuu();
    } catch (error) {
      alert(error.message);
    }
  }


  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Phòng khám</h1>
          <p>
            Đặt lịch khám nhanh chóng bằng
            họ tên và số điện thoại
          </p>
        </div>
      </header>

      <main className="container">

        {/* ===================== */}
        {/* DANH SÁCH BÁC SĨ */}
        {/* ===================== */}

        <section className="card">
          <h2>👨‍⚕️ Bác sĩ</h2>

          {loadingBacSi ? (
            <p>Đang tải...</p>
          ) : (
            <div className="doctor-list">
              {danhSachBacSi.map(
                (bacSi) => (
                  <div
                    className="doctor-card"
                    key={bacSi._id}
                  >
                    <div className="doctor-avatar">
                      BS
                    </div>

                    <div>
                      <strong>
                        {bacSi.hoTen}
                      </strong>

                      <p>
                        {bacSi.soDienThoai}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>


        {/* ===================== */}
        {/* ĐẶT LỊCH */}
        {/* ===================== */}

        <section className="card">
          <h2>📅 Đặt lịch khám</h2>

          <form
            className="booking-form"
            onSubmit={handleDatLich}
          >
            <div className="form-grid">
              <label>
                Họ và tên

                <input
                  name="hoTen"
                  value={form.hoTen}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </label>

              <label>
                Số điện thoại

                <input
                  name="soDienThoai"
                  value={form.soDienThoai}
                  onChange={handleChange}
                  placeholder="0987654321"
                  required
                />
              </label>
            </div>

            <label>
              Chọn bác sĩ

              <select
                name="bacSiId"
                value={form.bacSiId}
                onChange={handleChange}
                required
              >
                {danhSachBacSi.map(
                  (bacSi) => (
                    <option
                      key={bacSi._id}
                      value={bacSi._id}
                    >
                      {bacSi.hoTen}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="form-grid">
              <label>
                Thời gian bắt đầu

                <input
                  type="datetime-local"
                  name="thoiGianBatDau"
                  value={
                    form.thoiGianBatDau
                  }
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Thời gian kết thúc

                <input
                  type="datetime-local"
                  name="thoiGianKetThuc"
                  value={
                    form.thoiGianKetThuc
                  }
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button
              className="primary-button"
              disabled={loadingDatLich}
            >
              {loadingDatLich
                ? 'Đang đặt lịch...'
                : 'Đặt lịch khám'}
            </button>
          </form>

          {thongBaoDatLich && (
            <div
              className={
                thongBaoDatLich.type ===
                'success'
                  ? 'message success'
                  : 'message error'
              }
            >
              {thongBaoDatLich.message}
            </div>
          )}
        </section>


        {/* ===================== */}
        {/* TRA CỨU */}
        {/* ===================== */}

        <section className="card">
          <h2>🔎 Tra cứu lịch khám</h2>

          <form
            className="search-box"
            onSubmit={handleTraCuu}
          >
            <input
              value={soDienThoaiTraCuu}
              onChange={(e) =>
                setSoDienThoaiTraCuu(
                  e.target.value
                )
              }
              placeholder="Nhập số điện thoại"
            />

            <button className="primary-button">
              {loadingTraCuu
                ? 'Đang tìm...'
                : 'Tra cứu'}
            </button>
          </form>

          {ketQuaTraCuu?.error && (
            <div className="message error">
              {ketQuaTraCuu.error}
            </div>
          )}

          {ketQuaTraCuu?.benhNhan && (
            <div className="lookup-result">

              <div className="patient-info">
                <strong>
                  {
                    ketQuaTraCuu.benhNhan
                      .hoTen
                  }
                </strong>

                <span>
                  {
                    ketQuaTraCuu.benhNhan
                      .soDienThoai
                  }
                </span>
              </div>

              <h3>Lịch khám</h3>

              {ketQuaTraCuu.lichKham
                .length === 0 ? (
                <p>Chưa có lịch khám.</p>
              ) : (
                ketQuaTraCuu.lichKham.map(
                  (lich) => (
                    <div
                      className="appointment"
                      key={lich._id}
                    >
                      <div>
                        <strong>
                          {
                            lich.bacSiId
                              ?.hoTen
                          }
                        </strong>

                        <p>
                          {new Date(
                            lich.thoiGianBatDau
                          ).toLocaleString(
                            'vi-VN'
                          )}
                        </p>
                      </div>

                      <div className="appointment-right">

                        <span
                          className={`status ${lich.trangThai}`}
                        >
                          {
                            lich.trangThai
                          }
                        </span>

                        {lich.trangThai ===
                          'CHO_KHAM' && (
                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleHuyLich(
                                lich._id
                              )
                            }
                          >
                            Hủy lịch
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PublicPage;