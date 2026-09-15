import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import LoginView from '../views/LoginView';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');
      if (!token || !user) return;
      navigate(user.vaiTro === 'ADMIN' ? '/admin' : '/bac-si', { replace: true });
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = await login.submitLogin();
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      const macDinh = data.data.user.vaiTro === 'ADMIN' ? '/admin' : '/bac-si';
      navigate(location.state?.from || macDinh, { replace: true });
    } catch {
      // useLogin đã cập nhật thông báo lỗi.
    }
  }

  return <LoginView {...login} handleLogin={handleLogin} />;
}

export default LoginPage;
