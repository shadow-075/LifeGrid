import api from './api';

export const getEntriesForYear = (year) =>
  api.get(`/entries/year/${year}`).then((res) => res.data);

export const getEntryByDate = (date) =>
  api.get(`/entries/${date}`).then((res) => res.data);

export const createEntry = (payload) =>
  api.post('/entries', payload).then((res) => res.data);

export const updateEntry = (date, payload) =>
  api.put(`/entries/${date}`, payload).then((res) => res.data);

export const deleteEntry = (date) =>
  api.delete(`/entries/${date}`).then((res) => res.data);
