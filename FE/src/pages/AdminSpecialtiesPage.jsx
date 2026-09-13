import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layDanhSachChuyenKhoaAdmin,
  themChuyenKhoaAdmin,
  capNhatChuyenKhoaAdmin,
  xoaChuyenKhoaAdmin,
} from '../api/adminApi';


function AdminSpecialtiesPage() {
  const [danhSach, setDanhSach] =
    useState([]);

  const [tenChuyenKhoa, setTenChuyenKhoa] =
    useState('');

  const [
    chuyenKhoaDangSua,
    setChuyenKhoaDangSua,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');


  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const result =
        await layDanhSachChuyenKhoaAdmin();

      setDanhSach(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  function resetForm() {
    setTenChuyenKhoa('');
    setChuyenKhoaDangSua(null);
  }


  function batDauSua(item) {
    setChuyenKhoaDangSua(item);

    setTenChuyenKhoa(
      item.tenChuyenKhoa
    );

    setError('');
    setMessage('');
  }


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setMessage('');

      let result;

      if (chuyenKhoaDangSua) {
        result =
          await capNhatChuyenKhoaAdmin(
            chuyenKhoaDangSua._id,
            {
              tenChuyenKhoa,
            }
          );
      } else {
        result =
          await themChuyenKhoaAdmin({
            tenChuyenKhoa,
          });
      }

      setMessage(result.message);

      resetForm();

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }


  async function handleXoa(item) {
    const dongY =
      window.confirm(
        `Xóa chuyên khoa "${item.tenChuyenKhoa}"?`
      );

    if (!dongY) {
      return;
    }

    try {
      setError('');
      setMessage('');

      const result =
        await xoaChuyenKhoaAdmin(
          item._id
        );

      setMessage(result.message);

      await loadData();
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
              🏥 Quản lý chuyên khoa
            </h1>

            <Link to="/admin">
              ← Quay lại Admin
            </Link>
          </div>
        </div>


        <section className="admin-section">

          <h2>
            {chuyenKhoaDangSua
              ? 'Sửa chuyên khoa'
              : 'Thêm chuyên khoa'}
          </h2>

          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >

            <label>
              Tên chuyên khoa

              <input
                value={tenChuyenKhoa}
                onChange={(e) =>
                  setTenChuyenKhoa(
                    e.target.value
                  )
                }
                placeholder="Ví dụ: Nội khoa"
                required
              />
            </label>


            <div className="exam-buttons">

              <button
                type="submit"
                className="primary-button"
              >
                {chuyenKhoaDangSua
                  ? 'Lưu thay đổi'
                  : 'Thêm chuyên khoa'}
              </button>

              {chuyenKhoaDangSua && (
                <button
                  type="button"
                  onClick={resetForm}
                >
                  Hủy sửa
                </button>
              )}

            </div>
          </form>


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

        </section>


        <section className="admin-section">

          <h2>
            Danh sách chuyên khoa
          </h2>

          {loading ? (
            <p>
              Đang tải...
            </p>
          ) : (
            <div className="admin-doctor-list">

              {danhSach.map(
                (item) => (
                  <article
                    key={item._id}
                    className="admin-doctor-card"
                  >

                    <strong>
                      {
                        item
                          .tenChuyenKhoa
                      }
                    </strong>


                    <div className="exam-buttons">

                      <button
                        type="button"
                        onClick={() =>
                          batDauSua(item)
                        }
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                          handleXoa(item)
                        }
                      >
                        Xóa
                      </button>

                    </div>

                  </article>
                )
              )}

              {danhSach.length === 0 && (
                <p>
                  Chưa có chuyên khoa.
                </p>
              )}

            </div>
          )}

        </section>

      </section>
    </main>
  );
}

export default AdminSpecialtiesPage;