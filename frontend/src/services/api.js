import axios from 'axios';

// Em dev: vite.config.js proxy /api -> localhost:8000. Em prod: Nginx proxy /api -> backend.
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (whatsapp, name) => api.post('/auth/login', { whatsapp, name }),
  verifyCode: (whatsapp, code) => api.post('/auth/verify-code', { whatsapp, code }),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

export const appointmentService = {
  create: (serviceId, appointmentDate, notes = '') =>
    api.post('/appointments/', { service_id: serviceId, appointment_date: appointmentDate, notes }),
  list: () => api.get('/appointments/'),
  get: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.patch(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

export const publicService = {
  getServices: () => api.get('/services'),
  getBarbershops: () => api.get('/barbershops'),
  getHealth: () => api.get('/health'),
};

export default api;
