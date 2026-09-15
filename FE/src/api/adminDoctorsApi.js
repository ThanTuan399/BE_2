const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function layToken() {
  return localStorage.getItem('token');
}

async function xuLyResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
}

async function request(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), Authorization: `Bearer ${layToken()}`, ...options.headers };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  return xuLyResponse(response);
}

export function layDanhSachBacSiAdmin() {
  return request('/admin/bac-si');
}

export function layDanhSachChuyenKhoaAdmin() {
  return request('/admin/chuyen-khoa');
}

export function themBacSiAdmin(payload) {
  return request('/admin/bac-si', { method: 'POST', body: JSON.stringify(payload) });
}

export function capNhatBacSiAdmin(id, payload) {
  return request(`/admin/bac-si/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function xoaBacSiAdmin(id) {
  return request(`/admin/bac-si/${id}`, { method: 'DELETE' });
}
