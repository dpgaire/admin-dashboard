import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://ai-chatbot-api-ten.vercel.app/api';
// const API_BASE_URL = 'http://localhost:3000/api';
// const API_BASE_URL = 'http://localhost:3000/api';


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/users/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.put(`/users/${id}`, data);
    }
  },
  delete: (id) => api.delete(`/users/${id}`),
};


//About API
export const aboutAPI = {
  getAll: () => api.get('/about'),
  create: (data) => api.post('/about', data),
  update: (id, data) => api.put(`/about/${id}`, data),
  delete: (id) => api.delete(`/about/${id}`),
};

//About projects
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}
//Blog API
export const blogAPI = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
}
//Contact API
export const contactAPI = {
  getAll: () => api.get('/contact')
}

//User query API
export const userQueryAPI = {
  getAll: () => api.get('/queries')
}

//Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
}

// Training API
export const trainingAPI = {
  create: (data) => api.post('/train', data),
};

// Chat API
export const chatAPI = {
  create: (data) => api.post('/chat', data),
};

// Activity Log API
export const activityLogAPI = {
  getAll: () => api.get('/activity-logs'),
};




export default api;

