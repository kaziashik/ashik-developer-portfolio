import axios from 'axios'
import { useEffect, useMemo } from 'react'
import useAuth from './useAuth'
import { API_BASE_URL } from '../config/env'

const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the refreshToken httpOnly cookie
})

export default function useAxiosSecure() {
  const { tokenRef, refreshAccessToken, logout } = useAuth()

  const instance = useMemo(() => axiosSecure, [])

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use((config) => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`
      }
      return config
    })

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const newToken = await refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return instance(originalRequest)
          } catch (refreshError) {
            await logout()
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      instance.interceptors.request.eject(requestInterceptor)
      instance.interceptors.response.eject(responseInterceptor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance])

  return instance
}
