import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
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

function BaoVe({ role, children }) {
  return <ProtectedRoute role={role}>{children}</ProtectedRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/public" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ho-so-benh-nhan" element={<PatientProfilePage />} />

          <Route path="/bac-si" element={<BaoVe role="BAC_SI"><DoctorPage /></BaoVe>} />
          <Route path="/admin" element={<BaoVe role="ADMIN"><AdminPage /></BaoVe>} />
          <Route path="/admin/bac-si" element={<BaoVe role="ADMIN"><AdminDoctorsPage /></BaoVe>} />
          <Route path="/admin/benh-nhan" element={<BaoVe role="ADMIN"><AdminPatientsPage /></BaoVe>} />
          <Route path="/admin/lich-lam-viec" element={<BaoVe role="ADMIN"><AdminSchedulesPage /></BaoVe>} />
          <Route path="/admin/lich-kham" element={<BaoVe role="ADMIN"><AdminAppointmentsPage /></BaoVe>} />
          <Route path="/admin/thong-ke" element={<BaoVe role="ADMIN"><AdminStatisticsPage /></BaoVe>} />
          <Route path="/admin/chuyen-khoa" element={<BaoVe role="ADMIN"><AdminSpecialtiesPage /></BaoVe>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
