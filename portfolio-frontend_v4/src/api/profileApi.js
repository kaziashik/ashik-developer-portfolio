export const getProfile = (axiosInstance) =>
  axiosInstance.get('/api/profile').then((res) => res.data.data)

export const updateProfile = (axiosSecure, payload) =>
  axiosSecure.put('/api/profile', payload).then((res) => res.data.data)

export const addSkillCategory = (axiosSecure, type, payload) =>
  axiosSecure.patch(`/api/profile/skills/${type}`, payload).then((res) => res.data.data)

export const updateSkillCategory = (axiosSecure, type, skillId, payload) =>
  axiosSecure.patch(`/api/profile/skills/${type}/${skillId}`, payload).then((res) => res.data.data)

export const deleteSkillCategory = (axiosSecure, type, skillId) =>
  axiosSecure.delete(`/api/profile/skills/${type}/${skillId}`).then((res) => res.data.data)

export const reorderSkills = (axiosSecure, type, orderPairs) =>
  axiosSecure.patch(`/api/profile/skills/${type}/reorder`, orderPairs).then((res) => res.data.data)
