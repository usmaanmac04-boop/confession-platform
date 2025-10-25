import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Confession API calls
export const confessionAPI = {
  getAll: (params) => api.get('/confessions', { params }),
  create: (data) => api.post('/confessions', data),
  toggleHeart: (id, guestId) => api.post(`/confessions/${id}/heart`, { guestId }),
  delete: (id) => api.delete(`/confessions/${id}`),
  addComment: (id, data) => api.post(`/confessions/${id}/comment`, data),
  deleteComment: (confessionId, commentId) => api.delete(`/confessions/${confessionId}/comment/${commentId}`),
  toggleCommentLike: (confessionId, commentId, guestId) => api.post(`/confessions/${confessionId}/comment/${commentId}/like`, { guestId })  // Add this
};

export default api;