import { createContext, useContext, useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxios from '../hooks/useAxios'
import useAxiosSecure from '../hooks/useAxiosSecure'
import useAuth from '../hooks/useAuth'
import { fetchPortfolio } from '../api/portfolioApi'
import { mergeProfileLinks } from '../config/site'
import { sortByNewest } from '../utils/sortByNewest'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children, visibility = 'job' }) {
  const axiosPublic = useAxios()
  const axiosSecure = useAxiosSecure()
  const { isAdmin, authReady } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['portfolio', visibility, isAdmin],
    queryFn: () => fetchPortfolio({ axiosPublic, axiosSecure, isAdmin, visibility }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: authReady,
  })

  const refetchPortfolio = useCallback(async () => {
    const result = await query.refetch()
    return result.data
  }, [query])

  const invalidatePortfolio = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] })
  }, [queryClient])

  const value = useMemo(() => {
    const data = query.data
    return {
      profile: mergeProfileLinks(data?.profile),
      experiences: sortByNewest(data?.experiences),
      education: sortByNewest(data?.education),
      projects: sortByNewest(data?.projects),
      loading: !authReady || query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
      refetchPortfolio,
      refetchProfile: refetchPortfolio,
      invalidatePortfolio,
    }
  }, [query.data, query.isLoading, query.isFetching, query.error, authReady, refetchPortfolio, invalidatePortfolio])

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
