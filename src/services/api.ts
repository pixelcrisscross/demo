import axios from 'axios';

const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const jobService = {
  getAll: () => api.get('/jobs'),
  create: (jobData: any) => api.post('/jobs', jobData),
  update: (id: string, jobData: any) => api.put(`/jobs/${id}`, jobData),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  apply: (id: string, uid: string) => api.post(`/jobs/${id}/apply`, { uid }),
};

export const userService = {
  getProfile: (uid: string) => api.get(`/users/${uid}`),
  create: (userData: any) => api.post('/users', userData),
  update: (uid: string, userData: any) => api.put(`/users/${uid}`, userData),
  getCollegeStudents: (collegeId: string) => api.get(`/colleges/${collegeId}/students`),
};
