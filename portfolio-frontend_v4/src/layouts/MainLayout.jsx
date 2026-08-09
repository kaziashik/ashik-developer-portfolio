import { Suspense } from 'react'
import { Outlet } from 'react-router'
import AuthProvider from '../contexts/AuthProvider'
import { PortfolioProvider } from '../contexts/PortfolioProvider'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import SocialRail from '../ui/SocialRail'
import PageLoader from '../ui/skeletons/PageLoader'
import InteractiveDotGrid from '../ui/InteractiveDotGrid'

export default function MainLayout() {
  return (
    <AuthProvider>
      <PortfolioProvider visibility="job">
        <div className="min-h-screen bg-base-100 text-base-content relative md:pl-16">
          <InteractiveDotGrid />
          <div className="relative z-10">
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
