import { createContext, useContext, useCallback, useMemo } from 'react'
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

  const publicQuery = useQuery({
    queryKey: ['portfolio', visibility, 'public'],
    queryFn: () => fetchPublicPortfolio(visibility),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnMount: false,
  })

  const adminQuery = useQuery({
    queryKey: ['portfolio', visibility, 'admin'],
    queryFn: () => getPortfolioForAdmin(axiosSecure, { visibility }),
    staleTime: 30 * 1000,
    enabled: Boolean(authReady && isAdmin),
    retry: 1,
    refetchOnMount: false,
  })

  const data = isAdmin && adminQuery.data ? adminQuery.data : publicQuery.data

  const refetchPortfolio = useCallback(async () => {
    const results = await Promise.all([
      publicQuery.refetch(),
      isAdmin ? adminQuery.refetch() : Promise.resolve(null),
    ])
    return isAdmin ? results[1]?.data ?? results[0]?.data : results[0]?.data
  }, [publicQuery, adminQuery, isAdmin])

  const invalidatePortfolio = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      queryClient.invalidateQueries({ queryKey: ['experiences'] }),
      queryClient.invalidateQueries({ queryKey: ['education'] }),
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['profile'] }),
      queryClient.invalidateQueries({ queryKey: ['project'] }),
    ])
  }, [queryClient])

  const value = useMemo(() => {
    const loading = publicQuery.isPending || publicQuery.isLoading
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
