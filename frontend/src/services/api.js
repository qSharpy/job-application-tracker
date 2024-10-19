// frontend/src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });

export const getJobApplications = () => api.get('/job-applications');
export const createJobApplication = (data) => api.post('/job-applications', data);
export const updateJobApplication = (id, data) => api.put(`/job-applications/${id}`, data);
export const deleteJobApplication = (id) => api.delete(`/job-applications/${id}`);

export default api;