import axios from 'axios';
import { API_BASE_URL } from '@env';

console.log('🌐 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  config => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  r => {
    console.log('📥 API Response:', r.status, r.config.url);
    return r;
  },
  err => {
    console.error('❌ API Error:', err.message);
    console.error('❌ Error details:', err.response?.data || err.message);
    const msg = err?.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);
