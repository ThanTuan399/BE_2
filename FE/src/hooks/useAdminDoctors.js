import { useEffect, useState } from 'react';
import { layDanhSachBacSiAdmin, layDanhSachChuyenKhoaAdmin, themBacSiAdmin, capNhatBacSiAdmin, xoaBacSiAdmin } from '../api/adminDoctorsApi';

const formRong = { hoTen: '', soDienThoai: '', chuyenKhoaId: '', tenDangNhap: '', matKhau: '' };

function useAdminDoctors() {
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachChuyenKhoa, setDanhSachChuyenKhoa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [bacSiDangSua, setBacSiDangSua] = useState(null);
  const [form, setForm] = useState(formRong);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [bacSiResult, chuyenKhoaResult] = await Promise.all([layDanhSachBacSiAdmin(), layDanhSachChuyenKhoaAdmin()]);
      setDanhSach(bacSiResult.data);
      setDanhSachChuyenKhoa(chuyenKhoaResult.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(formRong);
    setBacSiDangSua(null);
  }

  function batDauSua(bacSi) {
    setBacSiDangSua(bacSi);
    setMessage('');
    setError('');
    setForm({ hoTen: bacSi.hoTen, soDienThoai: bacSi.soDienThoai, chuyenKhoaId: bacSi.chuyenKhoaId?._id || '', tenDangNhap: '', matKhau: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setDangXuLy(true);
      setError('');
      setMessage('');

      const result = bacSiDangSua
        ? await capNhatBacSiAdmin(bacSiDangSua._id, { hoTen: form.hoTen, soDienThoai: form.soDienThoai, chuyenKhoaId: form.chuyenKhoaId })
        : await themBacSiAdmin(form);

      setMessage(result.message);
      resetForm();
      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setDangXuLy(false);
    }
  }

  async function handleXoaBacSi(bacSi) {
    const dongY = window.confirm(`Bạn có chắc muốn xóa bác sĩ ${bacSi.hoTen}?`);
    if (!dongY) return;

    try {
      setDangXuLy(true);
      setError('');
      setMessage('');
      const result = await xoaBacSiAdmin(bacSi._id);
      setMessage(result.message);
      if (bacSiDangSua?._id === bacSi._id) resetForm();
      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setDangXuLy(false);
    }
  }

  return { danhSach, danhSachChuyenKhoa, loading, dangXuLy, error, message, bacSiDangSua, form, handleChange, resetForm, batDauSua, handleSubmit, handleXoaBacSi };
}

export default useAdminDoctors;
