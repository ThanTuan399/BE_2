const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function xuLyResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
}

export async function dangNhap(payload) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return xuLyResponse(response);
}
