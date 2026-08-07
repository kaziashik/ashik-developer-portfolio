// Public: only ever returns projects with isPublic !== false (enforced server-side)
export const getProjects = (axiosInstance, params = {}) =>
  axiosInstance.get('/api/projects', { params }).then((res) => res.data.data)

export const getProjectById = (axiosInstance, id) =>
  axiosInstance.get(`/api/projects/${id}`).then((res) => res.data.data)

// Admin-only: returns every project regardless of isPublic, so the dashboard/inline
// admin controls can see (and toggle) hidden ones too.
// Requires the backend addition documented alongside this project: GET /api/projects/admin
export const getAllProjectsForAdmin = (axiosSecure, params = {}) =>
  axiosSecure.get('/api/projects/admin', { params }).then((res) => res.data.data)

export const createProject = (axiosSecure, payload) =>
  axiosSecure.post('/api/projects', payload).then((res) => res.data.data)

export const updateProject = (axiosSecure, id, payload) =>
  axiosSecure.patch(`/api/projects/${id}`, payload).then((res) => res.data.data)

export const deleteProject = (axiosSecure, id) =>
  axiosSecure.delete(`/api/projects/${id}`).then((res) => res.data.data)
