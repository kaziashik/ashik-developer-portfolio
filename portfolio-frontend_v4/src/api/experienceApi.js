export const getExperiences = (axiosInstance, params = {}) =>
  axiosInstance.get('/api/experiences', { params }).then((res) => res.data.data)

// Admin-only: returns every experience regardless of isPublic.
// Requires the backend addition documented in BACKEND_ADDITIONS_REQUIRED.md
export const getAllExperiencesForAdmin = (axiosSecure, params = {}) =>
  axiosSecure.get('/api/experiences/admin', { params }).then((res) => res.data.data)

export const createExperience = (axiosSecure, payload) =>
  axiosSecure.post('/api/experiences', payload).then((res) => res.data.data)

export const updateExperience = (axiosSecure, id, payload) =>
  axiosSecure.patch(`/api/experiences/${id}`, payload).then((res) => res.data.data)

export const deleteExperience = (axiosSecure, id) =>
  axiosSecure.delete(`/api/experiences/${id}`).then((res) => res.data.data)
