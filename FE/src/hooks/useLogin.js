import { useState } from 'react';
import { dangNhap } from '../api/authApi';

export default function useLogin() {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitLogin() {
    try {
      setLoading(true);
      setError('');
      return await dangNhap({ tenDangNhap, matKhau });
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { tenDangNhap, setTenDangNhap, matKhau, setMatKhau, loading, error, submitLogin };
}
