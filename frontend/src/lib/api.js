import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Routes API
export const routesAPI = {
  getAll: () => api.get('/api/routes'),
  getById: (id) => api.get(`/api/routes/${id}`),
  create: (routeData) => api.post('/api/routes', routeData),
  update: (id, routeData) => api.put(`/api/routes/${id}`, routeData),
  delete: (id) => api.delete(`/api/routes/${id}`),
  searchByCity: (city) => api.get(`/api/routes/search?city=${city}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
};

export default api;
