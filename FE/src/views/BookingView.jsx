function BookingView({
  danhSachBacSi, loadingBacSi, lichTrong, loadingLichTrong, errorLichTrong, form, thongBaoDatLich,
  soDienThoaiTraCuu, setSoDienThoaiTraCuu, ketQuaTraCuu, loadingDatLich, loadingTraCuu, bacSiDaChon,
  handleChange, chonBacSi, chonKhungGio, hienThiThu, dinhDangNgay, hienThiTrangThai, handleDatLich, handleTraCuu, handleHuyLich,
}) {
  return (
    <main className="page-container public-page">
      <section className="page-title-box">
        <h1>Đặt lịch khám</h1>
        <p>Chọn bác sĩ và khung giờ còn trống để đặt lịch.</p>
      </section>

      <div className="booking-layout">
        <aside className="doctor-column section-card">
          <h2>Bác sĩ</h2>

          {loadingBacSi ? (
            <p>Đang tải danh sách bác sĩ...</p>
          ) : danhSachBacSi.length === 0 ? (
            <p>Chưa có bác sĩ.</p>
          ) : (
            <div className="doctor-list-vertical">
              {danhSachBacSi.map((bacSi) => (
                <button type="button" key={bacSi._id} className={form.bacSiId === bacSi._id ? 'doctor-item active' : 'doctor-item'} onClick={() => chonBacSi(bacSi._id)}>
                  <strong>{bacSi.hoTen}</strong>
                  <span>{bacSi.chuyenKhoaId?.tenChuyenKhoa || 'Chưa phân chuyên khoa'}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="booking-content">
          <section className="section-card">
            <h2>Thông tin đặt lịch</h2>

            <form className="booking-form-simple" onSubmit={handleDatLich}>
              <label>Họ và tên<input name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Nguyễn Văn A" required /></label>
              <label>Số điện thoại<input name="soDienThoai" value={form.soDienThoai} onChange={handleChange} placeholder="0987654321" required /></label>

              <div className="selected-doctor-box">
                <span>Bác sĩ đã chọn</span>
                <strong>{bacSiDaChon?.hoTen || 'Chưa chọn bác sĩ'}</strong>
                <small>Chuyên khoa: {bacSiDaChon?.chuyenKhoaId?.tenChuyenKhoa || 'Chưa có'}</small>
              </div>

              <div className="available-schedule">
                <h3>Lịch trống trong 7 ngày tới</h3>
                {loadingLichTrong && <p>Đang tải lịch trống...</p>}
                {errorLichTrong && <div className="message error">{errorLichTrong}</div>}

                {!loadingLichTrong && !errorLichTrong && (
                  <div className="available-days">
                    {lichTrong.map((ngay) => (
                      <div className="available-day" key={ngay.ngay}>
                        <h4>{hienThiThu(ngay.thuTrongTuan)} - {dinhDangNgay(ngay.ngay)}</h4>

                        {!ngay.coLichLamViec ? (
                          <p>Bác sĩ không làm việc.</p>
                        ) : ngay.khungGio.length === 0 ? (
                          <p>Không còn giờ trống.</p>
                        ) : (
                          <div className="available-slots">
                            {ngay.khungGio.map((gio) => (
                              <button type="button" key={`${ngay.ngay}-${gio}`} className={form.ngayKham === ngay.ngay && form.gioBatDau === gio ? 'time-slot selected' : 'time-slot'} onClick={() => chonKhungGio(ngay.ngay, gio)}>{gio}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="selected-time-row">
                <div><span>Ngày khám</span><strong>{form.ngayKham ? dinhDangNgay(form.ngayKham) : 'Chưa chọn'}</strong></div>
                <div><span>Giờ khám</span><strong>{form.gioBatDau || 'Chưa chọn'}</strong></div>
              </div>

              <button className="primary-button" disabled={loadingDatLich}>{loadingDatLich ? 'Đang đặt lịch...' : 'Đặt lịch khám'}</button>
            </form>

            {thongBaoDatLich && <div className={thongBaoDatLich.type === 'success' ? 'message success' : 'message error'}>{thongBaoDatLich.message}</div>}
          </section>

          <section className="section-card">
            <h2>Tra cứu lịch khám</h2>

            <form className="lookup-form" onSubmit={handleTraCuu}>
              <input value={soDienThoaiTraCuu} onChange={(e) => setSoDienThoaiTraCuu(e.target.value)} placeholder="Nhập số điện thoại" />
              <button className="primary-button">{loadingTraCuu ? 'Đang tìm...' : 'Tra cứu'}</button>
            </form>

            {ketQuaTraCuu?.error && <div className="message error">{ketQuaTraCuu.error}</div>}

            {ketQuaTraCuu?.benhNhan && (
              <div className="lookup-result">
                <div className="patient-info-simple"><strong>{ketQuaTraCuu.benhNhan.hoTen}</strong><span>{ketQuaTraCuu.benhNhan.soDienThoai}</span></div>
                <h3>Lịch khám</h3>

                {ketQuaTraCuu.lichKham.length === 0 ? (
                  <p>Chưa có lịch khám.</p>
                ) : (
                  <div className="appointment-list-simple">
                    {ketQuaTraCuu.lichKham.map((lich) => (
                      <article className="appointment-simple" key={lich._id}>
                        <div>
                          <strong>{lich.bacSiId?.hoTen}</strong>
                          <p>Chuyên khoa: {lich.bacSiId?.chuyenKhoaId?.tenChuyenKhoa || 'Chưa phân chuyên khoa'}</p>
                          <p>{new Date(lich.thoiGianBatDau).toLocaleString('vi-VN')}</p>
                        </div>

                        <div className="appointment-simple-actions">
                          <span className={`status ${lich.trangThai}`}>{hienThiTrangThai(lich.trangThai)}</span>
                          {lich.trangThai === 'CHO_KHAM' && <button type="button" className="cancel-button" onClick={() => handleHuyLich(lich._id)}>Hủy lịch</button>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default BookingView;
