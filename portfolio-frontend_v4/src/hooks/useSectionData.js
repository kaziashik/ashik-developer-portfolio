import { useQuery } from '@tanstack/react-query'
import { fetchPublicProfile } from '../api/publicFetch'
import { getAllProjectsForAdmin } from '../api/projectsApi'
import { getAllExperiencesForAdmin } from '../api/experienceApi'
import { getAllEducationForAdmin } from '../api/educationApi'
import { sortByNewest } from '../utils/sortByNewest'
import { usePortfolio } from '../contexts/PortfolioProvider'
import { mergeProfileLinks } from '../config/site'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

/**
 * Public visitors: use portfolio bundle (single fetch) — no duplicate section GETs.
 * Admin: load /admin lists so hidden items stay available for show/hide CRUD.
 */
export function useExperiencesData(visibility = 'job') {
  const { experiences: fromBundle, loading: bundleLoading, refetchPortfolio } = usePortfolio()
  const { isAdmin, authReady } = useAuth()
  const axiosSecure = useAxiosSecure()

  const adminQuery = useQuery({
    queryKey: ['experiences', visibility, 'admin'],
    queryFn: () => getAllExperiencesForAdmin(axiosSecure, { visibility }),
    staleTime: 30 * 1000,
    retry: 1,
    enabled: Boolean(authReady && isAdmin),
  })

  if (isAdmin) {
    const list = sortByNewest(Array.isArray(adminQuery.data) ? adminQuery.data : fromBundle)
    const loading = list.length === 0 && (adminQuery.isPending || adminQuery.isFetching || bundleLoading)
    return {
      data: list,
      loading,
      error: adminQuery.error,
      refetch: async () => {
        await adminQuery.refetch()
        await refetchPortfolio()
      },
    }
  }

  return {
    data: sortByNewest(fromBundle),
    loading: bundleLoading && (!fromBundle || fromBundle.length === 0),
    error: null,
    refetch: refetchPortfolio,
  }
}

export function useEducationData(visibility = 'job') {
  const { education: fromBundle, loading: bundleLoading, refetchPortfolio } = usePortfolio()
  const { isAdmin, authReady } = useAuth()
  const axiosSecure = useAxiosSecure()

  const adminQuery = useQuery({
    queryKey: ['education', visibility, 'admin'],
    queryFn: () => getAllEducationForAdmin(axiosSecure, { visibility }),
    staleTime: 30 * 1000,
    retry: 1,
    enabled: Boolean(authReady && isAdmin),
  })

  if (isAdmin) {
    const list = sortByNewest(Array.isArray(adminQuery.data) ? adminQuery.data : fromBundle)
    const loading = list.length === 0 && (adminQuery.isPending || adminQuery.isFetching || bundleLoading)
    return {
      data: list,
      loading,
      error: adminQuery.error,
      refetch: async () => {
        await adminQuery.refetch()
        await refetchPortfolio()
      },
    }
  }

  return {
    data: sortByNewest(fromBundle),
    loading: bundleLoading && (!fromBundle || fromBundle.length === 0),
    error: null,
    refetch: refetchPortfolio,
  }
}

export function useProjectsData(visibility = 'job') {
  const { projects: fromBundle, loading: bundleLoading, refetchPortfolio } = usePortfolio()
  const { isAdmin, authReady } = useAuth()
  const axiosSecure = useAxiosSecure()

  const adminQuery = useQuery({
    queryKey: ['projects', visibility, 'admin'],
    queryFn: () => getAllProjectsForAdmin(axiosSecure, { visibility }),
    staleTime: 30 * 1000,
    retry: 1,
    enabled: Boolean(authReady && isAdmin),
  })

  if (isAdmin) {
    const list = Array.isArray(adminQuery.data) ? adminQuery.data : fromBundle || []
    const loading = list.length === 0 && (adminQuery.isPending || adminQuery.isFetching || bundleLoading)
    return {
      data: list,
      loading,
      error: adminQuery.error,
      refetch: async () => {
        await adminQuery.refetch()
        await refetchPortfolio()
      },
    }
  }

  return {
    data: fromBundle || [],
    loading: bundleLoading && (!fromBundle || fromBundle.length === 0),
    error: null,
    refetch: refetchPortfolio,
  }
}

export function useSkillsData() {
  const { profile: fromBundle, loading: bundleLoading, refetchPortfolio } = usePortfolio()
  const query = useQuery({
    queryKey: ['profile', 'public'],
    queryFn: () => fetchPublicProfile(),
    staleTime: 60 * 1000,
    retry: 2,
    // Prefer warm prefetch / portfolio; only refetch if cache empty
    enabled: true,
    placeholderData: fromBundle || undefined,
  })

  const profile = query.data
    ? mergeProfileLinks(query.data)
    : fromBundle

  const skillGroups = [...(profile?.developmentSkills || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )

  const loading = skillGroups.length === 0 && (query.isPending || query.isFetching || bundleLoading)

  return {
    profile,
    skillGroups,
    loading,
    error: query.error,
    refetch: async () => {
      await query.refetch()
      await refetchPortfolio()
    },
  }
}
