import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://secuvault-backend.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token from login response
api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string) => 
    api.post('/auth/register', { email, password }),
  
  login: (email: string, password: string, twoFactorCode?: string) => 
    api.post('/auth/login', { email, password, twoFactorCode }),
  
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  
  setup2FA: () => api.post('/auth/2fa/setup'),
  
  verify2FA: (token: string) => api.post('/auth/2fa/verify', { token })
};

export const vaultAPI = {
  getItems: (search?: string) => 
    api.get('/vault', { params: search ? { search } : {} }),
  
  createItem: (item: any) => api.post('/vault', item),
  
  updateItem: (id: string, item: any) => api.put(`/vault/${id}`, item),
  
  deleteItem: (id: string) => api.delete(`/vault/${id}`)
};

export default api;