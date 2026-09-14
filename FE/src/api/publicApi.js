const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

async function xuLyResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Có lỗi xảy ra'
    );
  }

  return data;
}

export async function layDanhSachBacSi() {
  const response = await fetch(
    `${API_URL}/public/danh-sach-bac-si`
  );

  return xuLyResponse(response);
}

export async function layLichTrongBacSi(bacSiId) {
  const response = await fetch(`${API_URL}/public/lich-trong/${bacSiId}`);
  return xuLyResponse(response);
}

export async function datLich(payload) {
  const response = await fetch(
    `${API_URL}/public/dat-lich`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    }
  );

  return xuLyResponse(response);
}

export async function traCuuLich(soDienThoai) {
  const response = await fetch(
    `${API_URL}/public/tra-cuu/${soDienThoai}`
  );

  return xuLyResponse(response);
}

export async function huyLich(
  lichKhamId,
  soDienThoai
) {
  const response = await fetch(
    `${API_URL}/public/huy-lich/${lichKhamId}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        soDienThoai,
      }),
    }
  );

  return xuLyResponse(response);
}