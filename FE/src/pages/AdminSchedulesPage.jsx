import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  layDanhSachBacSiAdmin,
  layLichLamViecAdmin,
  themLichLamViecAdmin,
  capNhatLichLamViecAdmin,
} from '../api/adminApi';

const TEN_THU = {
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
  7: 'Chủ nhật',
};

function AdminSchedulesPage() {
  const [bacSi, setBacSi] =
    useState([]);

  const [lichLamViec, setLichLamViec] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [
    lichDangSua,
    setLichDangSua,
  ] = useState(null);

  const [form, setForm] =
    useState({
      bacSiId: '',
      thuTrongTuan: '1',
      gioBatDau: '08:00',
      gioKetThuc: '12:00',
    });


  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [
        bacSiResult,
        lichResult,
      ] = await Promise.all([
        layDanhSachBacSiAdmin(),
        layLichLamViecAdmin(),
      ]);

      setBacSi(
        bacSiResult.data
      );

      setLichLamViec(
        lichResult.data
      );

      if (
        bacSiResult.data.length > 0
      ) {
        setForm((prev) => ({
          ...prev,

          bacSiId:
            prev.bacSiId ||
            bacSiResult
              .data[0]._id,
        }));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


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
    setLichDangSua(null);

    setForm((prev) => ({
      bacSiId:
        bacSi[0]?._id || '',

      thuTrongTuan: '1',

      gioBatDau: '08:00',
      gioKetThuc: '12:00',
    }));
  }


  function batDauSua(lich) {
    setLichDangSua(lich);

    setMessage('');
    setError('');

    setForm({
      bacSiId:
        lich.bacSiId?._id,

      thuTrongTuan:
        String(
          lich.thuTrongTuan
        ),

      gioBatDau:
        lich.gioBatDau,

      gioKetThuc:
        lich.gioKetThuc,
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setMessage('');

      const payload = {
        bacSiId:
          form.bacSiId,

        thuTrongTuan:
          Number(
            form.thuTrongTuan
          ),

        gioBatDau:
          form.gioBatDau,

        gioKetThuc:
          form.gioKetThuc,
      };

      let result;

      if (lichDangSua) {
        result =
          await capNhatLichLamViecAdmin(
            lichDangSua._id,
            {
              ...payload,

              dangHoatDong:
                lichDangSua
                  .dangHoatDong,
            }
          );
      } else {
        result =
          await themLichLamViecAdmin(
            payload
          );
      }

      setMessage(
        result.message
      );

      resetForm();

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }


  async function doiTrangThai(lich) {
    try {
      setError('');
      setMessage('');

      const result =
        await capNhatLichLamViecAdmin(
          lich._id,
          {
            bacSiId:
              lich.bacSiId._id,

            thuTrongTuan:
              lich.thuTrongTuan,

            gioBatDau:
              lich.gioBatDau,

            gioKetThuc:
              lich.gioKetThuc,

            dangHoatDong:
              !lich.dangHoatDong,
          }
        );

      setMessage(
        result.message
      );

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <main className="simple-page">
      <section className="simple-card">

        <h1>
          🕒 Quản lý lịch làm việc
        </h1>

        <Link to="/admin">
          ← Quay lại Admin
        </Link>


        <section className="admin-section">
          <h2>
            {lichDangSua
              ? 'Sửa ca làm việc'
              : 'Thêm ca làm việc'}
          </h2>

          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >

            <label>
              Bác sĩ

              <select
                name="bacSiId"
                value={form.bacSiId}
                onChange={handleChange}
                required
              >
                {bacSi.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.hoTen}
                    </option>
                  )
                )}
              </select>
            </label>


            <label>
              Thứ trong tuần

              <select
                name="thuTrongTuan"
                value={
                  form.thuTrongTuan
                }
                onChange={
                  handleChange
                }
              >
                {Object.entries(
                  TEN_THU
                ).map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>


            <div className="form-grid">
              <label>
                Giờ bắt đầu

                <input
                  type="time"
                  name="gioBatDau"
                  value={
                    form.gioBatDau
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </label>

              <label>
                Giờ kết thúc

                <input
                  type="time"
                  name="gioKetThuc"
                  value={
                    form.gioKetThuc
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </label>
            </div>


            <div className="exam-buttons">
              <button
                className="primary-button"
              >
                {lichDangSua
                  ? 'Lưu thay đổi'
                  : 'Thêm ca làm việc'}
              </button>

              {lichDangSua && (
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
            Danh sách lịch làm việc
          </h2>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="admin-doctor-list">

              {lichLamViec.map(
                (lich) => (
                  <article
                    className="admin-doctor-card"
                    key={lich._id}
                  >
                    <div>
                      <h3>
                        {
                          lich.bacSiId
                            ?.hoTen
                        }
                      </h3>

                      <p>
                        <strong>
                          {
                            TEN_THU[
                              lich
                                .thuTrongTuan
                            ]
                          }
                        </strong>
                      </p>

                      <p>
                        {
                          lich
                            .gioBatDau
                        }
                        {' → '}
                        {
                          lich
                            .gioKetThuc
                        }
                      </p>

                      <p>
                        Trạng thái:{' '}

                        <strong>
                          {
                            lich
                              .dangHoatDong
                              ? 'Đang hoạt động'
                              : 'Đã tắt'
                          }
                        </strong>
                      </p>
                    </div>


                    <div className="exam-buttons">
                      <button
                        type="button"
                        onClick={() =>
                          batDauSua(
                            lich
                          )
                        }
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          doiTrangThai(
                            lich
                          )
                        }
                      >
                        {
                          lich
                            .dangHoatDong
                            ? 'Tắt'
                            : 'Bật'
                        }
                      </button>
                    </div>
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

export default AdminSchedulesPage;