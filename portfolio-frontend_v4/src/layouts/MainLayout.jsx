import { Suspense } from 'react'
import { Outlet } from 'react-router'
import AuthProvider from '../contexts/AuthProvider'
import { PortfolioProvider } from '../contexts/PortfolioProvider'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import SocialRail from '../ui/SocialRail'
import PageLoader from '../ui/skeletons/PageLoader'

export default function MainLayout() {
  return (
    <AuthProvider>
      <PortfolioProvider visibility="job">
        <div className="min-h-screen bg-base-100 text-base-content relative md:pl-16">
          <div className="fixed inset-0 bg-grid-dots pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <SocialRail />
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
            <Footer />
          </div>
        </div>
      </PortfolioProvider>
    </AuthProvider>
  )
}
