const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

async function xuLyResponse(
  response
) {
  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Có lỗi xảy ra'
    );
  }

  return data;
}

function layToken() {
  return localStorage.getItem(
    'token'
  );
}


// =============================
// Bác sĩ
// =============================

export async function
layDanhSachBacSiAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/bac-si`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}


export async function
themBacSiAdmin(payload) {
  const response =
    await fetch(
      `${API_URL}/admin/bac-si`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}


export async function
capNhatBacSiAdmin(
  id,
  payload
) {
  const response =
    await fetch(
      `${API_URL}/admin/bac-si/${id}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}

// =============================
// Bệnh nhân
// =============================

export async function
layDanhSachBenhNhanAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/benh-nhan`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}

// =============================
// Lịch làm việc
// =============================

export async function
layLichLamViecAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/lich-lam-viec`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}


export async function
themLichLamViecAdmin(payload) {
  const response =
    await fetch(
      `${API_URL}/admin/lich-lam-viec`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}


export async function
capNhatLichLamViecAdmin(
  id,
  payload
) {
  const response =
    await fetch(
      `${API_URL}/admin/lich-lam-viec/${id}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}

// =============================
// Lịch khám
// =============================

export async function
layTatCaLichKhamAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/lich-kham`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}


export async function
huyLichKhamAdmin(id) {
  const response =
    await fetch(
      `${API_URL}/admin/lich-kham/${id}/huy`,
      {
        method: 'PATCH',

        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}

// =============================
// Thống kê
// =============================

export async function
layThongKeAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/thong-ke`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}


// =============================
// Chuyên khoa
// =============================

export async function
layDanhSachChuyenKhoaAdmin() {
  const response =
    await fetch(
      `${API_URL}/admin/chuyen-khoa`,
      {
        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}


export async function
themChuyenKhoaAdmin(payload) {
  const response =
    await fetch(
      `${API_URL}/admin/chuyen-khoa`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}


export async function
capNhatChuyenKhoaAdmin(
  id,
  payload
) {
  const response =
    await fetch(
      `${API_URL}/admin/chuyen-khoa/${id}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${layToken()}`,
        },

        body:
          JSON.stringify(payload),
      }
    );

  return xuLyResponse(response);
}


export async function
xoaChuyenKhoaAdmin(id) {
  const response =
    await fetch(
      `${API_URL}/admin/chuyen-khoa/${id}`,
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${layToken()}`,
        },
      }
    );

  return xuLyResponse(response);
}