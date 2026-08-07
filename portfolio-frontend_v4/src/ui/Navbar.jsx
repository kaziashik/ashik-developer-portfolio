import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'
import AdminBadge from './AdminBadge'
import { navItems } from '../utils/data'
import { SOCIAL_LINKS } from '../config/site'
import { useActiveSection } from '../utils/useActiveSection'
import { cn } from '../utils/cn'
import useAuth from '../hooks/useAuth'
import { useProfileData } from '../contexts/ProfileContext'

const sectionIds = navItems.filter((n) => !n.isRoute).map((n) => n.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const activeId = useActiveSection(isHome ? sectionIds : [])
  const { isAdmin } = useAuth()
  const { profile } = useProfileData()

  const socials = {
    github: profile?.links?.github || SOCIAL_LINKS.github,
    linkedin: profile?.links?.linkedin || SOCIAL_LINKS.linkedin,
    email: profile?.email || '',
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSectionClick = (e, item) => {
    e.preventDefault()
    setOpen(false)
    if (isHome) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
        scrolled ? 'glass border-b border-base-300' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAdmin ? '/' : '/login'} className="font-display font-bold text-xl text-base-content">
          Kazi Ashik <span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 eyebrow text-sm uppercase">
          {navItems.map((item) =>
            item.isRoute ? (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  'pb-1 border-b-2 transition-colors',
                  location.pathname === item.href
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'
                )}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleSectionClick(e, item)}
                className={cn(
                  'pb-1 border-b-2 transition-colors cursor-pointer',
                  activeId === item.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'
                )}
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 text-base-content/60">
          <AdminBadge />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a href={socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm btn-circle">
            <FiGithub className="w-4 h-4" />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm btn-circle">
            <FiLinkedin className="w-4 h-4" />
          </a>
          {socials.email && (
            <a href={`mailto:${socials.email}`} className="btn btn-ghost btn-sm btn-circle">
              <FiMail className="w-4 h-4" />
            </a>
          )}
          <AdminBadge />
          <ThemeToggle />
          <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden glass border-t border-base-300 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4 eyebrow text-sm uppercase">
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link key={item.id} to={item.href} onClick={() => setOpen(false)} className="text-base-content/60 hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleSectionClick(e, item)}
                    className="text-base-content/60 hover:text-primary"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
