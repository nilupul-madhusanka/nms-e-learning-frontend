import axios from 'axios';

const API_BASE_URL = 'https://fresh-crabs-beam.loca.lt/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getAdminStats: () => api.get('/auth/admin/stats'),
  getAllStudents: () => api.get('/auth/admin/students'),
  deleteStudent: (id) => api.delete(`/auth/admin/students/${id}`),
  updateStudent: (id, studentData) => api.put(`/auth/admin/students/${id}`, studentData),
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  buyCourse: (id) => api.post(`/courses/buy/${id}`),
  getMyCourses: () => api.get('/courses/my'),
  getCourseLessons: (id) => api.get(`/courses/lessons/${id}`),
};

export default api;
