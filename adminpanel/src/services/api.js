import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const adminAPI = {
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
    getActivities: (limit = 50) => api.get(`/admin/activities?limit=${limit}`),
    getUsers: (page = 1, limit = 20) => api.get(`/admin/users?page=${page}&limit=${limit}`),
    getMiningSessions: (page = 1, limit = 20) => api.get(`/admin/mining?page=${page}&limit=${limit}`),
    getPayments: (page = 1, limit = 20) => api.get(`/admin/payments?page=${page}&limit=${limit}`),
    processPayment: (walletAddress) => api.post('/admin/payments/process', { walletAddress }),
    getReferrals: (page = 1, limit = 20) => api.get(`/admin/referrals?page=${page}&limit=${limit}`),
    getDailyRewards: (page = 1, limit = 20) => api.get(`/admin/daily-rewards?page=${page}&limit=${limit}`),
};

export default api;
