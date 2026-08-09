import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'
import useAuth from '../hooks/useAuth'
import { fetchPublicPortfolio } from '../api/publicFetch'
import { getPortfolioForAdmin } from '../api/portfolioApi'
import { mergeProfileLinks } from '../config/site'
import { sortByNewest } from '../utils/sortByNewest'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children, visibility = 'job' }) {
  const axiosSecure = useAxiosSecure()
  const { isAdmin, authReady } = useAuth()
  const queryClient = useQueryClient()

  // Always load the PUBLIC portfolio first — never block on admin auth.
  // This fixes empty Experience/Education when admin session race/fails.
  const publicQuery = useQuery({
    queryKey: ['portfolio', visibility, 'public'],
    queryFn: () => fetchPublicPortfolio(visibility),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnMount: true,
    enabled: true,
  })

  // Admin overlay (includes hidden items) — optional, never replaces public data on failure
  const adminQuery = useQuery({
    queryKey: ['portfolio', visibility, 'admin'],
    queryFn: () => getPortfolioForAdmin(axiosSecure, { visibility }),
    staleTime: 30 * 1000,
    enabled: Boolean(authReady && isAdmin),
    retry: 1,
  })

  // Prefetch section endpoints in parallel for snappier section mounts
  useEffect(() => {
    const v = visibility
    queryClient.prefetchQuery({
      queryKey: ['experiences', v],
      queryFn: () => import('../api/publicFetch').then((m) => m.fetchPublicExperiences(v)),
    })
    queryClient.prefetchQuery({
      queryKey: ['education', v],
      queryFn: () => import('../api/publicFetch').then((m) => m.fetchPublicEducation(v)),
    })
    queryClient.prefetchQuery({
      queryKey: ['projects', v],
      queryFn: () => import('../api/publicFetch').then((m) => m.fetchPublicProjects(v)),
    })
  }, [queryClient, visibility])

  const data = isAdmin && adminQuery.data ? adminQuery.data : publicQuery.data

  const refetchPortfolio = useCallback(async () => {
    const results = await Promise.all([
      publicQuery.refetch(),
      isAdmin ? adminQuery.refetch() : Promise.resolve(null),
    ])
    return results[0]?.data
  }, [publicQuery, adminQuery, isAdmin])

  const invalidatePortfolio = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    queryClient.invalidateQueries({ queryKey: ['experiences'] })
    queryClient.invalidateQueries({ queryKey: ['education'] })
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }, [queryClient])

  const value = useMemo(() => {
    const loading = publicQuery.isPending || publicQuery.isLoading
    // Important: do NOT invent a stub profile when data is missing —
    // a `{ links }` stub made Skills think loading was done with empty skills.
    const profile = data?.profile ? mergeProfileLinks(data.profile) : null
    return {
      profile,
      experiences: sortByNewest(data?.experiences),
      education: sortByNewest(data?.education),
      projects: sortByNewest(data?.projects),
      loading,
      isFetching: publicQuery.isFetching || adminQuery.isFetching,
      error: publicQuery.error,
      refetchPortfolio,
      refetchProfile: refetchPortfolio,
      invalidatePortfolio,
    }
  }, [
    data,
    publicQuery.isPending,
    publicQuery.isLoading,
    publicQuery.isFetching,
    publicQuery.error,
    adminQuery.isFetching,
    refetchPortfolio,
    invalidatePortfolio,
  ])

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return ctx
}

export default PortfolioContext
