import api from './api';

export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password }).then((res) => res.data);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);
