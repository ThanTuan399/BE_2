import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';



import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PublicPage from './pages/PublicPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorPage from './pages/DoctorPage';
import AdminPage from './pages/AdminPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';


function App() {
  return (
    <BrowserRouter>
      <nav className="main-nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/public">Bệnh nhân</Link>
        <Link to="/login">Đăng nhập</Link>
        <Link to="/bac-si">Bác sĩ</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/ho-so-benh-nhan">Hồ sơ bệnh nhân</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/public"
          element={<PublicPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/bac-si"
          element={<DoctorPage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/ho-so-benh-nhan"
          element={<PatientProfilePage />}
        />

        <Route
          path="/admin/bac-si"
          element={<AdminDoctorsPage />}
        />
      </Routes>

    </BrowserRouter>
  );
}

<Link
  to="/admin/bac-si"
  className="primary-button"
>
  Quản lý bác sĩ
</Link>

export default App;