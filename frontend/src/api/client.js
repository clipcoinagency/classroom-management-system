import axios from 'axios';

// In development, VITE_API_URL is unset, so requests go to the relative
// '/api' path and Vite's dev proxy (see vite.config.js) forwards them to
// the local backend. In production, VITE_API_URL points at the deployed
// Render backend, since there is no dev proxy in a static production build.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('classconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
