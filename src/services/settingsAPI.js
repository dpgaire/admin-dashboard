import api from './api';

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};
