import axios from 'axios';
import { API_BASE_URL } from '@env';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  r => r,
  err => {
    const msg = err?.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);
