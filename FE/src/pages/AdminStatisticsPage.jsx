import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layThongKeAdmin,
} from '../api/adminApi';


function AdminStatisticsPage() {
  const [thongKe, setThongKe] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  useEffect(() => {
    async function loadThongKe() {
      try {
        setLoading(true);
        setError('');

        const result =
          await layThongKeAdmin();

        setThongKe(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadThongKe();
  }, []);


  if (loading) {
    return (
      <main className="simple-page">
        <section className="simple-card">
          <p>
            Đang tải thống kê...
          </p>
        </section>
      </main>
    );
  }


  if (error) {
    return (
      <main className="simple-page">
        <section className="simple-card">
          <div className="message error">
            {error}
          </div>
        </section>
      </main>
    );
  }


  const tongQuan =
    thongKe?.tongQuan;

  const theoBacSi =
    thongKe?.theoBacSi || [];


  return (
    <main className="simple-page">
      <section className="simple-card">

        <div className="page-heading">
          <div>
            <h1>
              📊 Thống kê phòng khám
            </h1>

            <Link to="/admin">
              ← Quay lại Admin
            </Link>
          </div>
        </div>


        {/* TỔNG QUAN */}

        <section className="admin-section">
          <h2>
            Tổng quan
          </h2>

          <div className="statistics-grid">

            <div className="statistics-card">
              <span>
                Bệnh nhân
              </span>

              <strong>
                {
                  tongQuan
                    .tongBenhNhan
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Bác sĩ
              </span>

              <strong>
                {
                  tongQuan
                    .tongBacSi
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Tổng lịch khám
              </span>

              <strong>
                {
                  tongQuan
                    .tongLichKham
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Chờ khám
              </span>

              <strong>
                {
                  tongQuan
                    .choKham
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Hoàn thành
              </span>

              <strong>
                {
                  tongQuan
                    .hoanThanh
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Đã hủy
              </span>

              <strong>
                {
                  tongQuan
                    .daHuy
                }
              </strong>
            </div>


            <div className="statistics-card">
              <span>
                Tỷ lệ hoàn thành
              </span>

              <strong>
                {
                  tongQuan
                    .tyLeHoanThanh
                }%
              </strong>
            </div>

          </div>
        </section>


        {/* THEO BÁC SĨ */}

        <section className="admin-section">
          <h2>
            Thống kê theo bác sĩ
          </h2>

          {theoBacSi.length === 0 ? (
            <p>
              Chưa có bác sĩ.
            </p>
          ) : (
            <div className="statistics-table-wrap">

              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>
                      Bác sĩ
                    </th>

                    <th>
                      Tổng
                    </th>

                    <th>
                      Chờ khám
                    </th>

                    <th>
                      Hoàn thành
                    </th>

                    <th>
                      Đã hủy
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {theoBacSi.map(
                    (item) => (
                      <tr
                        key={
                          item.bacSiId
                        }
                      >
                        <td>
                          <strong>
                            {
                              item
                                .hoTen
                            }
                          </strong>

                          <br />

                          <small>
                            {
                              item
                                .soDienThoai
                            }
                          </small>
                        </td>

                        <td>
                          {
                            item
                              .tongLich
                          }
                        </td>

                        <td>
                          {
                            item
                              .choKham
                          }
                        </td>

                        <td>
                          {
                            item
                              .hoanThanh
                          }
                        </td>

                        <td>
                          {
                            item
                              .daHuy
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

            </div>
          )}
        </section>

      </section>
    </main>
  );
}

export default AdminStatisticsPage;