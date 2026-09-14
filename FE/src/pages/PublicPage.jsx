import { useEffect, useState } from 'react';

import {
  layDanhSachBacSi,
  layLichTrongBacSi,
  datLich,
  traCuuLich,
  huyLich,
} from '../api/publicApi';

function PublicPage() {
  
  const [danhSachBacSi, setDanhSachBacSi] =
    useState([]);

  const [loadingBacSi, setLoadingBacSi] =
    useState(true);

  const [lichTrong, setLichTrong] = useState([]);
  const [loadingLichTrong, setLoadingLichTrong] = useState(false);
  const [errorLichTrong, setErrorLichTrong] = useState('');

  const [form, setForm] = useState({
    hoTen: '',
    soDienThoai: '',
    bacSiId: '',
    ngayKham: '',
    gioBatDau: '',
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

  async function loadLichTrong(bacSiId) {
    if (!bacSiId) {
      setLichTrong([]);
      return;
    }

    try {
      setLoadingLichTrong(true);
      setErrorLichTrong('');

      const result = await layLichTrongBacSi(bacSiId);
      setLichTrong(result.data);
    } catch (error) {
      setLichTrong([]);
      setErrorLichTrong(error.message);
    } finally {
      setLoadingLichTrong(false);
    }
  }

  useEffect(() => {
    if (form.bacSiId) {
      loadLichTrong(form.bacSiId);
    }
  }, [form.bacSiId]);

  // ==========================
  // Form
  // ==========================

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'bacSiId') {
      setForm((prev) => ({
        ...prev,
        bacSiId: value,
        ngayKham: '',
        gioBatDau: '',
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function chonKhungGio(ngay, gio) {
    setForm((prev) => ({
      ...prev,
      ngayKham: ngay,
      gioBatDau: gio,
    }));

    setThongBaoDatLich(null);
  }

  function hienThiThu(thu) {
    const tenThu = {
      1: 'Thứ 2',
      2: 'Thứ 3',
      3: 'Thứ 4',
      4: 'Thứ 5',
      5: 'Thứ 6',
      6: 'Thứ 7',
      7: 'Chủ nhật',
    };

    return tenThu[thu] || '';
  }

  function dinhDangNgay(ngay) {
    const [nam, thang, ngayTrongThang] = ngay.split('-');
    return `${ngayTrongThang}/${thang}/${nam}`;
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
        hoTen: form.hoTen,
        soDienThoai: form.soDienThoai,
        bacSiId: form.bacSiId,

        thoiGianBatDau: new Date(
          `${form.ngayKham}T${form.gioBatDau}:00`
        ).toISOString(),
      };
      
      const result = await datLich(payload);

      await loadLichTrong(form.bacSiId);

      setThongBaoDatLich({
        type: 'success',
        message: result.message,
      });

      setSoDienThoaiTraCuu(
        form.soDienThoai
      );

      setForm((prev) => ({
        ...prev,
        ngayKham: '',
        gioBatDau: '',
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

                      <p>
                        Chuyên khoa:{' '}

                        <strong>
                          {
                            bacSi
                              .chuyenKhoaId
                              ?.tenChuyenKhoa ||
                            'Chưa phân chuyên khoa'
                          }
                        </strong>
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
            {/* THÔNG TIN BỆNH NHÂN */}
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

            {/* CHỌN BÁC SĨ */}
            <label>
              Chọn bác sĩ

              <select
                name="bacSiId"
                value={form.bacSiId}
                onChange={handleChange}
                required
              >
                {danhSachBacSi.map((bacSi) => (
                  <option
                    key={bacSi._id}
                    value={bacSi._id}
                  >
                    {bacSi.hoTen}
                    {' - '}
                    {bacSi.chuyenKhoaId
                      ?.tenChuyenKhoa ||
                      'Chưa phân chuyên khoa'}
                  </option>
                ))}
              </select>
            </label>

            <section className="available-schedule">
              <h3>🗓️ Lịch trống trong 7 ngày tới</h3>

              {loadingLichTrong && <p>Đang tải lịch trống...</p>}

              {errorLichTrong && (
                <div className="message error">
                  {errorLichTrong}
                </div>
              )}

              {!loadingLichTrong && !errorLichTrong && (
                <div className="available-days">
                  {lichTrong.map((ngay) => (
                    <div className="available-day" key={ngay.ngay}>
                      <h4>
                        {hienThiThu(ngay.thuTrongTuan)} - {dinhDangNgay(ngay.ngay)}
                      </h4>

                      {!ngay.coLichLamViec ? (
                        <p>Bác sĩ không làm việc.</p>
                      ) : ngay.khungGio.length === 0 ? (
                        <p>Không còn giờ trống.</p>
                      ) : (
                        <div className="available-slots">
                          {ngay.khungGio.map((gio) => (
                            <button
                              type="button"
                              key={`${ngay.ngay}-${gio}`}
                              className={
                                form.ngayKham === ngay.ngay && form.gioBatDau === gio
                                  ? 'time-slot selected'
                                  : 'time-slot'
                              }
                              onClick={() => chonKhungGio(ngay.ngay, gio)}
                            >
                              {gio}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* NGÀY + GIỜ */}
            <div className="form-grid">
              <label>
                Ngày khám

                <input type="date" name="ngayKham" value={form.ngayKham} readOnly required />

              </label>

              <label>
                Giờ khám

                <input type="time" name="gioBatDau" value={form.gioBatDau} readOnly required />

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

                          <p>
                            Chuyên khoa:{' '}
                            {
                              lich.bacSiId
                                ?.chuyenKhoaId
                                ?.tenChuyenKhoa ||
                              'Chưa phân chuyên khoa'
                            }
                          </p>
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