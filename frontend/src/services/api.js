import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  console.log('Request:', config.method.toUpperCase(), config.url, config.data);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });

export const getJobApplications = () => api.get('/job-applications');
export const createJobApplication = (data) => api.post('/job-applications', data);
export const updateJobApplication = (id, data) => api.put(`/job-applications/${id}`, data);
export const deleteJobApplication = (id) => api.delete(`/job-applications/${id}`);

export default api;