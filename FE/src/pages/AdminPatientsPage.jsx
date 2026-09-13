import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layDanhSachBenhNhanAdmin,
} from '../api/adminApi';

function AdminPatientsPage() {
  const [danhSach, setDanhSach] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadBenhNhan() {
      try {
        setLoading(true);
        setError('');

        const result =
          await layDanhSachBenhNhanAdmin();

        setDanhSach(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBenhNhan();
  }, []);

  return (
    <main className="simple-page">
      <section className="simple-card">

        <div className="page-heading">
          <div>
            <h1>
              👥 Danh sách bệnh nhân
            </h1>

            <Link to="/admin">
              ← Quay lại Admin
            </Link>
          </div>
        </div>

        {loading && (
          <p>
            Đang tải bệnh nhân...
          </p>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          danhSach.length === 0 && (
            <p>
              Chưa có bệnh nhân.
            </p>
          )}

        {!loading &&
          !error && (
            <div className="admin-doctor-list">

              {danhSach.map(
                (benhNhan) => (
                  <article
                    className="admin-doctor-card"
                    key={benhNhan._id}
                  >
                    <div>
                      <h3>
                        {benhNhan.hoTen}
                      </h3>

                      <p>
                        Số điện thoại:{' '}
                        <strong>
                          {
                            benhNhan
                              .soDienThoai
                          }
                        </strong>
                      </p>

                      <p>
                        Ngày tạo hồ sơ:{' '}
                        {new Date(
                          benhNhan.createdAt
                        ).toLocaleDateString(
                          'vi-VN'
                        )}
                      </p>
                    </div>

                    <div className="patient-count">
                      <span>
                        Số lịch khám
                      </span>

                      <strong>
                        {
                          benhNhan
                            .soLichKham
                        }
                      </strong>
                    </div>
                  </article>
                )
              )}

            </div>
          )}
      </section>
    </main>
  );
}

export default AdminPatientsPage;