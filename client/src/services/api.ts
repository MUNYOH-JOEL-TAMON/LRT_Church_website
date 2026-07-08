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
// NOTE: Only redirect on 401 for protected routes, not for public API calls
// like fetching sermons/events — those should fail gracefully on the page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Only force-logout if the 401 came from an auth-required endpoint
      // Public endpoints (sermons, events) returning 401 should NOT redirect
      const isPublicEndpoint =
        url.includes('/sermons') ||
        url.includes('/events') ||
        url.includes('/prayer-requests/public');

      if (!isPublicEndpoint) {
        localStorage.removeItem('lrt_token');
        // We use window.location to avoid circular imports with the router
        window.location.href = '/portal/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
