import { useState } from 'react'
import { FiCheck, FiEdit2 } from 'react-icons/fi'
import AnimatedSection from '../AnimatedSection'
import AboutFormModal from '../modals/AboutFormModal'
import { useProfileData } from '../../contexts/ProfileContext'
import useAuth from '../../hooks/useAuth'

const FALLBACK_PARAGRAPHS = [
  'MERN Stack developer specializing in modern, responsive, and scalable web applications with a strong focus on user experience.',
  'Experienced in building high-performance frontends with React and Next.js, and developing secure, efficient backend services with Node.js, Express.js, and Prisma.',
]

const HIGHLIGHTS = [
  'Intuitive user interfaces and clean, maintainable frontend architecture',
  'Robust RESTful APIs with secure, efficient backend services',
  'Scalable software design focused on performance and long-term reliability',
]

function getAboutParagraphs(summary) {
  const blocks = (summary || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^proficient in/i.test(p))

  return blocks.length > 0 ? blocks.slice(0, 2) : FALLBACK_PARAGRAPHS
}

export default function About() {
  const { profile } = useProfileData()
  const { isAdmin } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const paragraphs = getAboutParagraphs(profile?.researchSummary)

  return (
    <AnimatedSection id="about" className="section-spacing max-w-6xl mx-auto px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-start">
      <div>
        <p className="eyebrow text-primary text-sm mb-3 uppercase">// about</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">A bit about me</h2>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm rounded-full gap-2 mt-4">
            <FiEdit2 className="w-3.5 h-3.5" /> Update
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="text-base md:text-lg text-base-content/70 space-y-4 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <ul className="space-y-3">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base md:text-lg text-base-content/70 leading-relaxed">
              <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && modalOpen && <AboutFormModal onClose={() => setModalOpen(false)} />}
    </AnimatedSection>
  )
}
