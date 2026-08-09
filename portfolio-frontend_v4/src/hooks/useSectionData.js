import { useQuery } from '@tanstack/react-query'
import {
  fetchPublicEducation,
  fetchPublicExperiences,
  fetchPublicProfile,
  fetchPublicProjects,
} from '../api/publicFetch'
import { sortByNewest } from '../utils/sortByNewest'
import { usePortfolio } from '../contexts/PortfolioProvider'
import { mergeProfileLinks } from '../config/site'

/**
 * Each section loads its own public API endpoint in parallel.
 * Uses portfolio-bundle data as an instant fallback while the section query settles.
 */
export function useExperiencesData(visibility = 'job') {
  const { experiences: fromBundle } = usePortfolio()
  const query = useQuery({
    queryKey: ['experiences', visibility],
    queryFn: () => fetchPublicExperiences(visibility),
    staleTime: 60 * 1000,
    retry: 2,
  })

  const list = sortByNewest(Array.isArray(query.data) ? query.data : fromBundle)
  const loading = list.length === 0 && (query.isPending || query.isFetching)

  return { data: list, loading, error: query.error, refetch: query.refetch }
}

export function useEducationData(visibility = 'job') {
  const { education: fromBundle } = usePortfolio()
  const query = useQuery({
    queryKey: ['education', visibility],
    queryFn: () => fetchPublicEducation(visibility),
    staleTime: 60 * 1000,
    retry: 2,
  })

  const list = sortByNewest(Array.isArray(query.data) ? query.data : fromBundle)
  const loading = list.length === 0 && (query.isPending || query.isFetching)

  return { data: list, loading, error: query.error, refetch: query.refetch }
}

export function useProjectsData(visibility = 'job') {
  const { projects: fromBundle } = usePortfolio()
  const query = useQuery({
    queryKey: ['projects', visibility],
    queryFn: () => fetchPublicProjects(visibility),
    staleTime: 60 * 1000,
    retry: 2,
  })

  const list = Array.isArray(query.data) ? query.data : fromBundle || []
  const loading = list.length === 0 && (query.isPending || query.isFetching)

  return { data: list, loading, error: query.error, refetch: query.refetch }
}

export function useSkillsData() {
  const { profile: fromBundle } = usePortfolio()
  const query = useQuery({
    queryKey: ['profile', 'public'],
    queryFn: () => fetchPublicProfile(),
    staleTime: 60 * 1000,
    retry: 2,
  })

  const profile = query.data
    ? mergeProfileLinks(query.data)
    : fromBundle

  const skillGroups = [...(profile?.developmentSkills || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )

  const loading = skillGroups.length === 0 && (query.isPending || query.isFetching)

  return {
    profile,
    skillGroups,
    loading,
    error: query.error,
    refetch: query.refetch,
  }
}
