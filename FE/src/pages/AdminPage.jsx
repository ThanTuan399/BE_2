function AdminPage() {
  const user = JSON.parse(
    localStorage.getItem('user') ||
      'null'
  );

  return (
    <main className="simple-page">
      <section className="simple-card">
        <h1>⚙️ Trang Admin</h1>

        {user?.vaiTro === 'ADMIN' ? (
          <>
            <p>
              Đã đăng nhập:
              {' '}
              <strong>
                {user.tenDangNhap}
              </strong>
            </p>

            <div className="message success">
              Xác thực ADMIN thành công.
            </div>

            <h2>
              Các chức năng sẽ triển khai
            </h2>

            <p>
              Quản lý bác sĩ
            </p>

            <p>
              Quản lý lịch làm việc
            </p>

            <p>
              Điều phối lịch khám
            </p>

            <p>
              Thống kê
            </p>
          </>
        ) : (
          <div className="message error">
            Hãy đăng nhập tài khoản ADMIN.
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminPage;