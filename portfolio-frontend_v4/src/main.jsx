import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes/router'
import { ThemeProvider } from './utils/ThemeContext'
import PageLoader from './ui/skeletons/PageLoader'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
})

// Prefetch portfolio data as soon as the app boots (before first paint settles)
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const warm = (path) =>
  fetch(`${String(apiBase).replace(/\/$/, '')}${path}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((body) => body?.data ?? null)
    .catch(() => null)

queryClient.prefetchQuery({
  queryKey: ['portfolio', 'job', 'public'],
  queryFn: () => warm('/api/portfolio?visibility=job'),
})
queryClient.prefetchQuery({
  queryKey: ['experiences', 'job'],
  queryFn: () => warm('/api/experiences?visibility=job'),
})
queryClient.prefetchQuery({
  queryKey: ['education', 'job'],
  queryFn: () => warm('/api/education?visibility=job'),
})
queryClient.prefetchQuery({
  queryKey: ['projects', 'job'],
  queryFn: () => warm('/api/projects?visibility=job'),
})
queryClient.prefetchQuery({
  queryKey: ['profile', 'public'],
  queryFn: () => warm('/api/profile'),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
