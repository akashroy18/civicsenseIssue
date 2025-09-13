import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// attach token
API.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('civic_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed.token || (parsed?.data?.token);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default API;
