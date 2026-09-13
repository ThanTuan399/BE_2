import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layTatCaLichKhamAdmin,
  huyLichKhamAdmin,
} from '../api/adminApi';


function AdminAppointmentsPage() {
  const [danhSach, setDanhSach] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [trangThai, setTrangThai] =
    useState('');

  const [bacSiId, setBacSiId] =
    useState('');

  const [
    soDienThoai,
    setSoDienThoai,
  ] = useState('');


  async function loadLichKham() {
    try {
      setLoading(true);
      setError('');

      const result =
        await layTatCaLichKhamAdmin();

      setDanhSach(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadLichKham();
  }, []);


  function hienThiTrangThai(
    value
  ) {
    if (value === 'CHO_KHAM') {
      return 'Chờ khám';
    }

    if (value === 'HOAN_THANH') {
      return 'Hoàn thành';
    }

    if (value === 'DA_HUY') {
      return 'Đã hủy';
    }

    return value;
  }


  // Danh sách bác sĩ lấy trực tiếp
  // từ các lịch hiện có
  const danhSachBacSi =
    Array.from(
      new Map(
        danhSach
          .filter(
            (lich) =>
              lich.bacSiId
          )
          .map((lich) => [
            lich.bacSiId._id,
            lich.bacSiId,
          ])
      ).values()
    );


  // ==========================
  // Lọc dữ liệu
  // ==========================

  const danhSachDaLoc =
    danhSach.filter((lich) => {
      const dungTrangThai =
        !trangThai ||
        lich.trangThai ===
          trangThai;

      const dungBacSi =
        !bacSiId ||
        lich.bacSiId?._id ===
          bacSiId;

      const sdt =
        lich.benhNhanId
          ?.soDienThoai || '';

      const dungSoDienThoai =
        !soDienThoai.trim() ||
        sdt.includes(
          soDienThoai.trim()
        );

      return (
        dungTrangThai &&
        dungBacSi &&
        dungSoDienThoai
      );
    });


  // ==========================
  // Admin hủy lịch
  // ==========================

  async function handleHuyLich(
    lich
  ) {
    const dongY =
      window.confirm(
        `Hủy lịch khám của ${lich.benhNhanId?.hoTen}?`
      );

    if (!dongY) {
      return;
    }

    try {
      setError('');
      setMessage('');

      const result =
        await huyLichKhamAdmin(
          lich._id
        );

      setMessage(
        result.message
      );

      await loadLichKham();
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <main className="simple-page">
      <section className="simple-card">

        <div className="page-heading">
          <div>
            <h1>
              📅 Điều phối lịch khám
            </h1>

            <Link to="/admin">
              ← Quay lại Admin
            </Link>
          </div>
        </div>


        {/* BỘ LỌC */}

        <section className="admin-section">
          <h2>
            Bộ lọc
          </h2>

          <div className="admin-filter-grid">

            <label>
              Trạng thái

              <select
                value={trangThai}
                onChange={(e) =>
                  setTrangThai(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Tất cả
                </option>

                <option value="CHO_KHAM">
                  Chờ khám
                </option>

                <option value="HOAN_THANH">
                  Hoàn thành
                </option>

                <option value="DA_HUY">
                  Đã hủy
                </option>
              </select>
            </label>


            <label>
              Bác sĩ

              <select
                value={bacSiId}
                onChange={(e) =>
                  setBacSiId(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Tất cả bác sĩ
                </option>

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


            <label>
              SĐT bệnh nhân

              <input
                value={soDienThoai}
                onChange={(e) =>
                  setSoDienThoai(
                    e.target.value
                  )
                }
                placeholder="Nhập SĐT..."
              />
            </label>

          </div>
        </section>


        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}


        {/* DANH SÁCH */}

        <section className="admin-section">
          <h2>
            Danh sách lịch khám
          </h2>

          <p>
            Kết quả:{' '}
            <strong>
              {
                danhSachDaLoc
                  .length
              }
            </strong>
          </p>

          {loading ? (
            <p>
              Đang tải...
            </p>
          ) : (
            <div className="admin-appointments">

              {danhSachDaLoc.map(
                (lich) => (
                  <article
                    className="admin-appointment"
                    key={lich._id}
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
                        SĐT:{' '}
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
                        {
                          hienThiTrangThai(
                            lich.trangThai
                          )
                        }
                      </span>

                      {lich.trangThai ===
                        'CHO_KHAM' && (
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            handleHuyLich(
                              lich
                            )
                          }
                        >
                          Hủy lịch
                        </button>
                      )}

                    </div>

                  </article>
                )
              )}

              {!loading &&
                danhSachDaLoc
                  .length === 0 && (
                  <p>
                    Không có lịch phù hợp.
                  </p>
                )}

            </div>
          )}
        </section>

      </section>
    </main>
  );
}

export default AdminAppointmentsPage;