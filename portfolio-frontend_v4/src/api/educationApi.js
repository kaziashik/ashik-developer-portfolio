export const getEducation = (axiosInstance, params = {}) =>
  axiosInstance.get('/api/education', { params }).then((res) => res.data.data)

// Admin-only: returns every education entry regardless of isPublic.
// Requires the backend addition documented in BACKEND_ADDITIONS_REQUIRED.md
export const getAllEducationForAdmin = (axiosSecure, params = {}) =>
  axiosSecure.get('/api/education/admin', { params }).then((res) => res.data.data)

export const createEducation = (axiosSecure, payload) =>
  axiosSecure.post('/api/education', payload).then((res) => res.data.data)

export const updateEducation = (axiosSecure, id, payload) =>
  axiosSecure.patch(`/api/education/${id}`, payload).then((res) => res.data.data)

export const deleteEducation = (axiosSecure, id) =>
  axiosSecure.delete(`/api/education/${id}`).then((res) => res.data.data)
