import {
  useState,
} from 'react';

import {
  traCuuLich,
  huyLich,
} from '../api/publicApi';

function PatientProfilePage() {
  const [soDienThoai, setSoDienThoai] =
    useState(
      localStorage.getItem(
        'benhNhanSoDienThoai'
      ) || ''
    );

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  function hienThiTrangThai(trangThai) {
    if (trangThai === 'CHO_KHAM') {
      return 'Chờ khám';
    }

    if (trangThai === 'HOAN_THANH') {
      return 'Hoàn thành';
    }

    if (trangThai === 'DA_HUY') {
      return 'Đã hủy';
    }

    return trangThai;
  }

  async function loadHoSo() {
    try {
      setLoading(true);
      setError('');

      const result =
        await traCuuLich(
          soDienThoai.trim()
        );

      setData(result.data);

      // Nhớ SĐT trên thiết bị
      localStorage.setItem(
        'benhNhanSoDienThoai',
        soDienThoai.trim()
      );
    } catch (error) {
      setData(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTraCuu(e) {
    e.preventDefault();

    if (!soDienThoai.trim()) {
      setError(
        'Vui lòng nhập số điện thoại'
      );

      return;
    }

    await loadHoSo();
  }

  async function handleHuyLich(
    lichKhamId
  ) {
    const dongY =
      window.confirm(
        'Bạn có chắc muốn hủy lịch khám này?'
      );

    if (!dongY) {
      return;
    }

    try {
      await huyLich(
        lichKhamId,
        soDienThoai.trim()
      );

      await loadHoSo();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="simple-page">
      <section className="simple-card">

        <h1>
          👤 Hồ sơ bệnh nhân
        </h1>

        <p>
          Nhập số điện thoại đã sử dụng
          khi đặt lịch để xem hồ sơ.
        </p>

        {/* TRA CỨU */}

        <form
          className="search-box"
          onSubmit={handleTraCuu}
        >
          <input
            value={soDienThoai}
            onChange={(e) =>
              setSoDienThoai(
                e.target.value
              )
            }
            placeholder="Ví dụ: 0981111111"
          />

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Đang tải...'
              : 'Xem hồ sơ'}
          </button>
        </form>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* HỒ SƠ */}

        {data?.benhNhan && (
          <>
            <section className="patient-profile-card">
              <h2>
                Thông tin bệnh nhân
              </h2>

              <p>
                <strong>
                  Họ tên:
                </strong>{' '}
                {data.benhNhan.hoTen}
              </p>

              <p>
                <strong>
                  Số điện thoại:
                </strong>{' '}
                {
                  data.benhNhan
                    .soDienThoai
                }
              </p>
            </section>

            <section className="patient-history">
              <h2>
                📋 Lịch sử khám
              </h2>

              {data.lichKham.length ===
              0 ? (
                <p>
                  Chưa có lịch khám.
                </p>
              ) : (
                data.lichKham.map(
                  (lich) => (
                    <article
                      className="patient-appointment-card"
                      key={lich._id}
                    >
                      <div className="patient-appointment-header">
                        <div>
                          <h3>
                            {
                              lich.bacSiId
                                ?.hoTen
                            }
                          </h3>

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
                          {hienThiTrangThai(
                            lich.trangThai
                          )}
                        </span>
                      </div>

                      {/* CHỜ KHÁM */}

                      {lich.trangThai ===
                        'CHO_KHAM' && (
                        <div className="patient-appointment-actions">
                          <p>
                            Lịch khám đang
                            chờ thực hiện.
                          </p>

                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                              handleHuyLich(
                                lich._id
                              )
                            }
                          >
                            Hủy lịch
                          </button>
                        </div>
                      )}

                      {/* ĐÃ HỦY */}

                      {lich.trangThai ===
                        'DA_HUY' && (
                        <p className="appointment-note">
                          Lịch khám này đã
                          được hủy.
                        </p>
                      )}

                      {/* HOÀN THÀNH */}

                      {lich.trangThai ===
                        'HOAN_THANH' && (
                        <div className="medical-result">
                          <h4>
                            🩺 Kết quả khám
                          </h4>

                          {lich.hoSoKham ? (
                            <>
                              <p>
                                <strong>
                                  Triệu chứng:
                                </strong>{' '}
                                {
                                  lich
                                    .hoSoKham
                                    .trieuChung
                                }
                              </p>

                              <p>
                                <strong>
                                  Chẩn đoán:
                                </strong>{' '}
                                {
                                  lich
                                    .hoSoKham
                                    .chanDoan
                                }
                              </p>
                            </>
                          ) : (
                            <p>
                              Chưa có hồ sơ
                              khám.
                            </p>
                          )}

                          <h4>
                            💊 Đơn thuốc
                          </h4>

                          {lich.donThuoc ? (
                            <p>
                              {
                                lich
                                  .donThuoc
                                  .chiTietThuoc
                              }
                            </p>
                          ) : (
                            <p>
                              Không có thông
                              tin đơn thuốc.
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  )
                )
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default PatientProfilePage;