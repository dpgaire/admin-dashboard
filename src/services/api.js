import axios from 'axios';

const API_BASE_URL = 'https://ai-chatbot-api-ten.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

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
        setAuthToken(accessToken);
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

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
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

// Notes API
export const notesAPI = {
  getAll: () => api.get('/notes'),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// Quick Links API
export const quickLinksAPI = {
  getAll: () => api.get('/quicklinks'),
  create: (data) => api.post('/quicklinks', data),
  update: (id, data) => api.put(`/quicklinks/${id}`, data),
  delete: (id) => api.delete(`/quicklinks/${id}`),
};


// Training API
export const trainingAPI = {
  getAll: () => api.get('/train'),
  getById: (id) => api.get(`/train/${id}`),
  create: (data) => api.post('/train', data),
  update: (id, data) => api.put(`/train/${id}`, data),
  delete: (id) => api.delete(`/train/${id}`),
};

// Chat API
export const chatAPI = {
  create: (data) => api.post('/chat', data),
};

// Activity Log API
export const activityLogAPI = {
  getAll: () => api.get('/activity-logs'),
};

export const statsAPI = {
  getAll: () => api.get('/stats'),
};

export default api;

