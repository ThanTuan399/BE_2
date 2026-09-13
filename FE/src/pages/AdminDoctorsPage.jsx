import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layDanhSachBacSiAdmin,
  themBacSiAdmin,
  capNhatBacSiAdmin,
  layDanhSachChuyenKhoaAdmin,
} from '../api/adminApi';

function AdminDoctorsPage() {
  const [danhSach, setDanhSach] =
    useState([]);

  const [ danhSachChuyenKhoa, setDanhSachChuyenKhoa,] = 
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [bacSiDangSua, setBacSiDangSua] =
    useState(null);

  const [form, setForm] =
    useState({
      hoTen: '',
      soDienThoai: '',
      chuyenKhoaId: '',
      tenDangNhap: '',
      matKhau: '',
    });


    async function loadData() {
    try {
        setLoading(true);
        setError('');

        const [
        bacSiResult,
        chuyenKhoaResult,
        ] = await Promise.all([
        layDanhSachBacSiAdmin(),
        layDanhSachChuyenKhoaAdmin(),
        ]);

        setDanhSach(
        bacSiResult.data
        );

        setDanhSachChuyenKhoa(
        chuyenKhoaResult.data
        );
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    }

    useEffect(() => {
     loadData();
    }, []);


  useEffect(() => {
    loadData();
  }, []);


  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function resetForm() {
  setForm({
    hoTen: '',
    soDienThoai: '',
    chuyenKhoaId: '',
    tenDangNhap: '',
    matKhau: '',
  });

  setBacSiDangSua(null);
}


  function batDauSua(bacSi) {
    setBacSiDangSua(bacSi);

    setMessage('');
    setError('');

    setForm({
        hoTen:
            bacSi.hoTen,

        soDienThoai:
            bacSi.soDienThoai,

        chuyenKhoaId:
            bacSi.chuyenKhoaId?._id || '',

        tenDangNhap: '',
        matKhau: '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setMessage('');

      if (bacSiDangSua) {
        const result =
          await capNhatBacSiAdmin(
            bacSiDangSua._id,
            {
                hoTen:
                form.hoTen,

                soDienThoai:
                form.soDienThoai,

                chuyenKhoaId:
                form.chuyenKhoaId,
            }
          );

        setMessage(
          result.message
        );
      } else {
        const result =
          await themBacSiAdmin({
            hoTen:
                form.hoTen,

            soDienThoai:
                form.soDienThoai,

            chuyenKhoaId:
                form.chuyenKhoaId,

            tenDangNhap:
                form.tenDangNhap,

            matKhau:
                form.matKhau,
          });

        setMessage(
          result.message
        );
      }

      resetForm();

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
              👨‍⚕️ Quản lý bác sĩ
            </h1>

            <Link to="/admin">
              ← Quay lại Admin
            </Link>
          </div>
        </div>


        {/* FORM */}

        <section className="admin-section">
          <h2>
            {bacSiDangSua
              ? 'Sửa bác sĩ'
              : 'Thêm bác sĩ'}
          </h2>

          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >
            <label>
              Họ tên

              <input
                name="hoTen"
                value={form.hoTen}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Số điện thoại

              <input
                name="soDienThoai"
                value={
                  form.soDienThoai
                }
                onChange={
                  handleChange
                }
                placeholder="0933333333"
                required
              />
            </label>

            <label>
                Chuyên khoa

                <select
                    name="chuyenKhoaId"
                    value={
                    form.chuyenKhoaId
                    }
                    onChange={
                    handleChange
                    }
                    required
                >
                    <option value="">
                    -- Chọn chuyên khoa --
                    </option>

                    {danhSachChuyenKhoa.map(
                    (chuyenKhoa) => (
                        <option
                        key={
                            chuyenKhoa._id
                        }
                        value={
                            chuyenKhoa._id
                        }
                        >
                        {
                            chuyenKhoa
                            .tenChuyenKhoa
                        }
                        </option>
                    )
                    )}
                </select>
            </label>

            {!bacSiDangSua && (
              <>
                <label>
                  Tên đăng nhập

                  <input
                    name="tenDangNhap"
                    value={
                      form.tenDangNhap
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="bacsi03"
                    required
                  />
                </label>

                <label>
                  Mật khẩu ban đầu

                  <input
                    type="password"
                    name="matKhau"
                    value={
                      form.matKhau
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>
              </>
            )}

            <div className="exam-buttons">
              <button
                className="primary-button"
                type="submit"
              >
                {bacSiDangSua
                  ? 'Lưu thay đổi'
                  : 'Thêm bác sĩ'}
              </button>

              {bacSiDangSua && (
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


        {/* DANH SÁCH */}

        <section className="admin-section">
          <h2>
            Danh sách bác sĩ
          </h2>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="admin-doctor-list">
              {danhSach.map(
                (bacSi) => (
                  <article
                    className="admin-doctor-card"
                    key={bacSi._id}
                  >
                    <div>
                      <h3>
                        {bacSi.hoTen}
                      </h3>

                      <p>
                        SĐT:{' '}
                        {
                          bacSi
                            .soDienThoai
                        }
                      </p>

                      <p>
                        Tài khoản:{' '}
                        <strong>
                          {
                            bacSi
                              .nguoiDungId
                              ?.tenDangNhap
                          }
                        </strong>
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

                    <button
                      type="button"
                      onClick={() =>
                        batDauSua(
                          bacSi
                        )
                      }
                    >
                      Sửa
                    </button>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDoctorsPage;