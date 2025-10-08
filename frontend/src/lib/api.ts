import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (email: string, password: string) => 
    api.post('/auth/register', { email, password }),
  
  login: (email: string, password: string, twoFactorCode?: string) => 
    api.post('/auth/login', { email, password, twoFactorCode }),
  
  logout: () => api.post('/auth/logout'),
  
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