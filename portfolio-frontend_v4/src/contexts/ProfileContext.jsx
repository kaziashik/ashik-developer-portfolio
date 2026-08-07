import { usePortfolio } from './PortfolioProvider'

export function ProfileProvider({ children }) {
  return children
}

export function useProfileData() {
  const { profile, loading, error, refetchProfile } = usePortfolio()
  return { profile, loading, error, refetchProfile }
}
