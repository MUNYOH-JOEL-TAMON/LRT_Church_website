import axios from 'axios';

// A single, configured Axios instance that all API calls share.
// The base URL points to our Node.js backend.
// VITE_API_URL is set at build time via environment variables.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lrt-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attaches the JWT token
// from localStorage to every outgoing authenticated request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lrt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: globally handles 401 Unauthorized responses.
// Only redirects to login if we're NOT already on a login/register page,
// and only clears storage + redirects — never causes a hard reload loop.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/portal/login') ||
        currentPath.includes('/portal/register');

      if (!isAuthPage) {
        localStorage.removeItem('lrt_token');
        localStorage.removeItem('lrt-auth-storage');
        window.location.href = '/portal/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
