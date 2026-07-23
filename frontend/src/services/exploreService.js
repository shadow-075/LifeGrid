import api from './api';

export const getPublicProfiles = () => api.get('/explore').then((res) => res.data);

export const getPublicProfileByUsername = (username) =>
  api.get(`/explore/${username}`).then((res) => res.data);
