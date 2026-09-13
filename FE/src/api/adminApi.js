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