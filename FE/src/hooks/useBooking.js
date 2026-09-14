import { useEffect, useState } from 'react';
import { datLich, huyLich, layDanhSachBacSi, layLichTrongBacSi, traCuuLich } from '../api/publicApi';

export default function useBooking() {
  const [danhSachBacSi, setDanhSachBacSi] = useState([]);
  const [loadingBacSi, setLoadingBacSi] = useState(true);
  const [lichTrong, setLichTrong] = useState([]);
  const [loadingLichTrong, setLoadingLichTrong] = useState(false);
  const [errorLichTrong, setErrorLichTrong] = useState('');
  const [form, setForm] = useState({ hoTen: '', soDienThoai: '', bacSiId: '', ngayKham: '', gioBatDau: '' });
  const [thongBaoDatLich, setThongBaoDatLich] = useState(null);
  const [soDienThoaiTraCuu, setSoDienThoaiTraCuu] = useState('');
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState(null);
  const [loadingDatLich, setLoadingDatLich] = useState(false);
  const [loadingTraCuu, setLoadingTraCuu] = useState(false);

  useEffect(() => {
    async function loadBacSi() {
      try {
        const result = await layDanhSachBacSi();
        setDanhSachBacSi(result.data);
        if (result.data.length > 0) setForm((prev) => ({ ...prev, bacSiId: result.data[0]._id }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingBacSi(false);
      }
    }

    loadBacSi();
  }, []);

  async function loadLichTrong(bacSiId) {
    if (!bacSiId) {
      setLichTrong([]);
      return;
    }

    try {
      setLoadingLichTrong(true);
      setErrorLichTrong('');
      const result = await layLichTrongBacSi(bacSiId);
      setLichTrong(result.data);
    } catch (error) {
      setLichTrong([]);
      setErrorLichTrong(error.message);
    } finally {
      setLoadingLichTrong(false);
    }
  }

  useEffect(() => {
    if (form.bacSiId) loadLichTrong(form.bacSiId);
  }, [form.bacSiId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function chonBacSi(bacSiId) {
    setForm((prev) => ({ ...prev, bacSiId, ngayKham: '', gioBatDau: '' }));
    setThongBaoDatLich(null);
  }

  function chonKhungGio(ngay, gio) {
    setForm((prev) => ({ ...prev, ngayKham: ngay, gioBatDau: gio }));
    setThongBaoDatLich(null);
  }

  function hienThiThu(thu) {
    const tenThu = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 7: 'Chủ nhật' };
    return tenThu[thu] || '';
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return '';
    const [nam, thang, ngayTrongThang] = ngay.split('-');
    return `${ngayTrongThang}/${thang}/${nam}`;
  }

  function hienThiTrangThai(trangThai) {
    const map = { CHO_KHAM: 'Chờ khám', HOAN_THANH: 'Hoàn thành', DA_HUY: 'Đã hủy' };
    return map[trangThai] || trangThai;
  }

  async function handleDatLich(e) {
    e.preventDefault();

    if (!form.bacSiId || !form.ngayKham || !form.gioBatDau) {
      setThongBaoDatLich({ type: 'error', message: 'Vui lòng chọn bác sĩ và khung giờ khám' });
      return;
    }

    try {
      setLoadingDatLich(true);
      setThongBaoDatLich(null);
      const payload = {
        hoTen: form.hoTen,
        soDienThoai: form.soDienThoai,
        bacSiId: form.bacSiId,
        thoiGianBatDau: new Date(`${form.ngayKham}T${form.gioBatDau}:00+07:00`).toISOString(),
      };

      const result = await datLich(payload);
      setThongBaoDatLich({ type: 'success', message: result.message });
      setSoDienThoaiTraCuu(form.soDienThoai);
      setForm((prev) => ({ ...prev, ngayKham: '', gioBatDau: '' }));
      await loadLichTrong(form.bacSiId);
    } catch (error) {
      setThongBaoDatLich({ type: 'error', message: error.message });
    } finally {
      setLoadingDatLich(false);
    }
  }

  async function handleTraCuu(e) {
    e?.preventDefault();
    if (!soDienThoaiTraCuu) return;

    try {
      setLoadingTraCuu(true);
      const result = await traCuuLich(soDienThoaiTraCuu);
      setKetQuaTraCuu(result.data);
    } catch (error) {
      setKetQuaTraCuu({ error: error.message });
    } finally {
      setLoadingTraCuu(false);
    }
  }

  async function handleHuyLich(id) {
    if (!window.confirm('Bạn có chắc muốn hủy lịch khám này?')) return;

    try {
      await huyLich(id, soDienThoaiTraCuu);
      await handleTraCuu();
      await loadLichTrong(form.bacSiId);
    } catch (error) {
      alert(error.message);
    }
  }

  const bacSiDaChon = danhSachBacSi.find((bacSi) => bacSi._id === form.bacSiId);

  return {
    danhSachBacSi, loadingBacSi, lichTrong, loadingLichTrong, errorLichTrong, form, thongBaoDatLich,
    soDienThoaiTraCuu, setSoDienThoaiTraCuu, ketQuaTraCuu, loadingDatLich, loadingTraCuu, bacSiDaChon,
    handleChange, chonBacSi, chonKhungGio, hienThiThu, dinhDangNgay, hienThiTrangThai, handleDatLich, handleTraCuu, handleHuyLich,
  };
}
