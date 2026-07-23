import api from './api';

export const getProfile = () => api.get('/profile').then((res) => res.data);

export const updateProfile = (payload) => api.put('/profile', payload).then((res) => res.data);
