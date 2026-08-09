import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCamera, FiUploadCloud } from 'react-icons/fi'
import ProfileImageModal from '../modals/ProfileImageModal'
import CVViewerModal from '../modals/CVViewerModal'
import CVUploadModal from '../modals/CVUploadModal'
import HeroTechStack from '../HeroTechStack'
import { useProfileData } from '../../contexts/ProfileContext'
import useAuth from '../../hooks/useAuth'
import { optimizeImageUrl } from '../../utils/imageUrl'
import fallbackImage from '../../assets/ashik2b.webp'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function getIntroParagraphs() {
  return [
    'MERN Stack developer building modern, responsive, and scalable web apps with React, Next.js, Node.js, Express.js, and Prisma — focused on clean UX and solid backend systems.',
  ]
}

function HeroPhoto({ image, name, isAdmin, onUpdateImage, variant = 'desktop' }) {
  const isMobile = variant === 'mobile'

  return (
    <div className={isMobile ? 'relative mx-auto w-full max-w-[280px] sm:max-w-xs' : 'relative ml-auto flex w-full justify-end'}>
      {!isMobile && <div aria-hidden="true" className="hero-photo-offset" />}
      <div className={`hero-photo-frame group ${isMobile ? 'mx-auto' : ''}`}>
        <div aria-hidden="true" className="hero-photo-accent-ring" />
        <img
          src={image}
          alt={name}
          width={500}
          height={500}
          fetchPriority="high"
          decoding="async"
          className={`block h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02] ${isMobile ? 'aspect-square' : ''}`}
        />
        {isAdmin && (
          <button
            type="button"
            onClick={onUpdateImage}
            className="absolute inset-3 z-20 bg-neutral/0 group-hover:bg-neutral/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <span className="inline-flex items-center gap-2 bg-primary text-primary-content px-4 py-2 eyebrow text-[10px] uppercase tracking-[0.15em]">
              <FiCamera className="w-3.5 h-3.5" /> Update Image
            </span>
          </button>
        )}
        <span className="hero-photo-badge">
          <span className="hero-photo-badge-prompt">&gt;_</span> Full stack software developer
        </span>
      </div>
    </div>
  )
}

export default function Hero() {
  const { profile } = useProfileData()
  const { isAdmin } = useAuth()
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [cvViewerOpen, setCvViewerOpen] = useState(false)
  const [cvUploadOpen, setCvUploadOpen] = useState(false)

  const name = profile?.name || 'Ashik'
  const firstName = name.split(' ')[0] || name
  const [intro] = getIntroParagraphs()
  const image = optimizeImageUrl(profile?.profileImageUrl, { width: 500 }) || fallbackImage
  const heroSkills = [...new Set((profile?.developmentSkills || []).flatMap((group) => group.items || []))].slice(0, 12)

  return (
    <section id="home" className="hero-profile relative overflow-hidden pt-24 pb-12 px-6 md:px-12 lg:px-16">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.p variants={item} className="hero-intro-label mb-4 flex items-center">
            <span className="cursor-blink mr-2 inline-block h-2 w-2 bg-primary shrink-0" aria-hidden="true" />
            Introduction
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-base-content mb-5 lg:mb-6"
          >
            Hi, This is <span className="text-primary">{firstName}.</span>
          </motion.h1>

          {/* Phone / tablet: photo directly under the name */}
          <motion.div variants={item} className="mb-6 lg:hidden">
            <HeroPhoto
              image={image}
              name={name}
              isAdmin={isAdmin}
              onUpdateImage={() => setImageModalOpen(true)}
              variant="mobile"
            />
          </motion.div>

          <motion.p variants={item} className="mb-6 max-w-xl text-base md:text-lg leading-relaxed text-base-content/65 lg:mb-7">
            {intro}
          </motion.p>

          <motion.div variants={item}>
            <HeroTechStack skills={heroSkills} />
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setCvViewerOpen(true)}
              className="hero-btn-primary group"
            >
              View CV
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <Link to="/contact" className="hero-btn-outline">
              Contact Me
            </Link>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setCvUploadOpen(true)}
                className="btn btn-ghost btn-sm rounded-none gap-2 eyebrow text-[11px] uppercase tracking-[0.15em]"
              >
                <FiUploadCloud className="w-3.5 h-3.5" /> Update CV
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Desktop: top of photo aligns with the "Hello..." heading */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="hidden lg:block lg:col-span-5 lg:pt-[4.35rem]"
        >
          <HeroPhoto
            image={image}
            name={name}
            isAdmin={isAdmin}
            onUpdateImage={() => setImageModalOpen(true)}
            variant="desktop"
          />
        </motion.div>
      </div>

      {isAdmin && imageModalOpen && <ProfileImageModal onClose={() => setImageModalOpen(false)} />}
      {cvViewerOpen && <CVViewerModal open onClose={() => setCvViewerOpen(false)} />}
      {isAdmin && cvUploadOpen && <CVUploadModal onClose={() => setCvUploadOpen(false)} />}
    </section>
  )
}
