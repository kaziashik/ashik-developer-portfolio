import { API_BASE_URL } from '../config/env'

function buildUrl(path, params = {}) {
  const base = String(API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${base}${cleanPath}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

/**
 * Fast public GET helper (no axios, no auth cookies).
 * Used so Experience / Education / Projects always load for visitors.
 */
export async function publicGet(path, params = {}) {
  const res = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`)
  }

  const body = await res.json()
  return body?.data ?? null
}

export const fetchPublicPortfolio = (visibility = 'job') =>
  publicGet('/api/portfolio', { visibility })

export const fetchPublicProfile = () => publicGet('/api/profile')

export const fetchPublicExperiences = (visibility = 'job') =>
  publicGet('/api/experiences', { visibility })

export const fetchPublicEducation = (visibility = 'job') =>
  publicGet('/api/education', { visibility })

export const fetchPublicProjects = (visibility = 'job') =>
  publicGet('/api/projects', { visibility })
