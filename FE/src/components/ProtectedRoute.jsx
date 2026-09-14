import { Navigate, useLocation } from 'react-router-dom';

function layNguoiDung() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function ProtectedRoute({ role, children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = layNguoiDung();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.vaiTro !== role) {
    const fallback = user.vaiTro === 'ADMIN' ? '/admin' : '/bac-si';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;
