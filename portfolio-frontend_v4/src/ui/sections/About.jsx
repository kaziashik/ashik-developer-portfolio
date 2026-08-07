import { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import AnimatedSection from '../AnimatedSection'
import AboutFormModal from '../modals/AboutFormModal'
import { useProfileData } from '../../contexts/ProfileContext'
import useAuth from '../../hooks/useAuth'

export default function About() {
  const { profile } = useProfileData()
  const { isAdmin } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const paragraphs = (profile?.researchSummary || '').split('\n').filter(Boolean)

  return (
    <AnimatedSection id="about" className="section-spacing max-w-6xl mx-auto px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
      <div>
        <p className="eyebrow text-primary text-sm mb-3 uppercase">// about</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">A bit about me</h2>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm rounded-full gap-2 mt-4">
            <FiEdit2 className="w-3.5 h-3.5" /> Update
          </button>
        )}
      </div>
      <div className="text-base md:text-lg text-base-content/70 space-y-4 leading-relaxed">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>Full-stack developer focused on building modern, responsive, and scalable web applications using React, Next.js, Node.js, Express.js, Tailwind CSS, Prisma, and MongoDB. Focused on creating clean, efficient, and user-friendly digital experiences.</p>
        )}
      </div>

      {isAdmin && modalOpen && <AboutFormModal onClose={() => setModalOpen(false)} />}
    </AnimatedSection>
  )
}
