const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '') || '/api';

export const getAuthToken = (isAdmin = false) => {
  return localStorage.getItem(isAdmin ? 'admin_token' : 'customer_token');
};

export async function request(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, isAdmin = false, isFormData = false } = options;

  const token = getAuthToken(isAdmin);
  const finalHeaders = { ...headers };

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && body && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${method} ${endpoint}:`, err.message);
    throw err;
  }
}
