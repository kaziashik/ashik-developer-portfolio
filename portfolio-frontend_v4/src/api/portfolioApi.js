export const getPortfolio = (axiosInstance, params = {}) =>
  axiosInstance.get('/api/portfolio', { params }).then((res) => res.data.data)

export const getPortfolioForAdmin = (axiosSecure, params = {}) =>
  axiosSecure.get('/api/portfolio/admin', { params }).then((res) => res.data.data)

export async function fetchPortfolio({ axiosPublic, axiosSecure, isAdmin, visibility = 'job' }) {
  const params = { visibility }

  if (isAdmin) {
    return getPortfolioForAdmin(axiosSecure, params)
  }

  return getPortfolio(axiosPublic, params)
}
