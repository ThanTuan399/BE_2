import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PublicPage from './pages/PublicPage';
import DoctorPage from './pages/DoctorPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <nav className="main-nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/public">Bệnh nhân</Link>
        <Link to="/login">Đăng nhập</Link>
        <Link to="/bac-si">Bác sĩ</Link>
        <Link to="/admin">Admin</Link>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;