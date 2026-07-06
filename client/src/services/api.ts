import axios from 'axios';

// A single, configured Axios instance that all API calls share.
// The base URL points to our Node.js backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
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
// This automatically logs the user out if their session has expired.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lrt_token');
      // We use window.location to avoid circular imports with the router
      window.location.href = '/portal/login';
    }
    return Promise.reject(error);
  }
);

export default api;
