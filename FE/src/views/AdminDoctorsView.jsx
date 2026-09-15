import { Link } from 'react-router-dom';
import '../styles/admin-doctors.css';

function AdminDoctorsView({ danhSach, danhSachChuyenKhoa, loading, dangXuLy, error, message, bacSiDangSua, form, handleChange, resetForm, batDauSua, handleSubmit, handleXoaBacSi }) {
  return (
    <main className="simple-page admin-doctors-page">
      <section className="simple-card">
        <div className="page-heading admin-doctors-heading">
          <div>
            <h1>Quản lý bác sĩ</h1>
            <Link to="/admin">← Quay lại Admin</Link>
          </div>
          <span>{danhSach.length} bác sĩ</span>
        </div>

        <section className="admin-section doctor-form-section">
          <h2>{bacSiDangSua ? 'Sửa bác sĩ' : 'Thêm bác sĩ'}</h2>

          <form className="booking-form doctor-form" onSubmit={handleSubmit}>
            <label>Họ tên<input name="hoTen" value={form.hoTen} onChange={handleChange} required /></label>
            <label>Số điện thoại<input name="soDienThoai" value={form.soDienThoai} onChange={handleChange} placeholder="0933333333" required /></label>
            <label>Chuyên khoa<select name="chuyenKhoaId" value={form.chuyenKhoaId} onChange={handleChange} required><option value="">-- Chọn chuyên khoa --</option>{danhSachChuyenKhoa.map((chuyenKhoa) => <option key={chuyenKhoa._id} value={chuyenKhoa._id}>{chuyenKhoa.tenChuyenKhoa}</option>)}</select></label>

            {!bacSiDangSua && (
              <>
                <label>Tên đăng nhập<input name="tenDangNhap" value={form.tenDangNhap} onChange={handleChange} placeholder="bacsi03" required /></label>
                <label>Mật khẩu ban đầu<input type="password" name="matKhau" value={form.matKhau} onChange={handleChange} required /></label>
              </>
            )}

            <div className="doctor-form-actions">
              <button className="primary-button" type="submit" disabled={dangXuLy}>{dangXuLy ? 'Đang xử lý...' : bacSiDangSua ? 'Lưu thay đổi' : 'Thêm bác sĩ'}</button>
              {bacSiDangSua && <button type="button" className="secondary-button" onClick={resetForm} disabled={dangXuLy}>Hủy sửa</button>}
            </div>
          </form>

          {message && <div className="message success">{message}</div>}
          {error && <div className="message error">{error}</div>}
        </section>

        <section className="admin-section">
          <h2>Danh sách bác sĩ</h2>

          {loading ? <p>Đang tải...</p> : danhSach.length === 0 ? <p>Chưa có bác sĩ.</p> : (
            <div className="doctor-admin-list">
              {danhSach.map((bacSi) => (
                <article className="doctor-admin-row" key={bacSi._id}>
                  <div className="doctor-admin-info">
                    <strong>{bacSi.hoTen}</strong>
                    <span>SĐT: {bacSi.soDienThoai}</span>
                    <span>Tài khoản: {bacSi.nguoiDungId?.tenDangNhap || 'Chưa có'}</span>
                    <span>Chuyên khoa: {bacSi.chuyenKhoaId?.tenChuyenKhoa || 'Chưa phân chuyên khoa'}</span>
                  </div>

                  <div className="doctor-admin-actions">
                    <button type="button" className="secondary-button" onClick={() => batDauSua(bacSi)} disabled={dangXuLy}>Sửa</button>
                    <button type="button" className="danger-button" onClick={() => handleXoaBacSi(bacSi)} disabled={dangXuLy}>Xóa</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDoctorsView;
