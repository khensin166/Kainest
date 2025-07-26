// src/lib/apiClient.js
import axios from 'axios';

// Ambil baseURL dari environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not defined. Please check your .env file.");
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//💡 BONUS: Di sini Anda juga bisa menambahkan interceptor
// untuk otomatis menambahkan token ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;