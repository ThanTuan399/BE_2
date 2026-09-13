import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';



import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PublicPage from './pages/PublicPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorPage from './pages/DoctorPage';
import AdminPage from './pages/AdminPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';
import AdminPatientsPage from './pages/AdminPatientsPage';
import AdminSchedulesPage from './pages/AdminSchedulesPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import AdminStatisticsPage from './pages/AdminStatisticsPage';
import AdminSpecialtiesPage from './pages/AdminSpecialtiesPage';

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

        <Route
          path="/admin/benh-nhan"
          element={<AdminPatientsPage />}
        />

        <Route
          path="/admin/lich-lam-viec"
          element={<AdminSchedulesPage />}
        />

        <Route
          path="/admin/lich-kham"
          element={<AdminAppointmentsPage />}
        />

        <Route
          path="/admin/thong-ke"
          element={
            <AdminStatisticsPage />
          }
        />

        <Route
          path="/admin/chuyen-khoa"
          element={
            <AdminSpecialtiesPage />
          }
        />
      </Routes>

    </BrowserRouter>
  );
}



export default App;