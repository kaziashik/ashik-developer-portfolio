import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2 } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import SkillsFormModal from '../modals/SkillsFormModal'
import TechSkillBadge from '../TechSkillBadge'
import { useSkillsData } from '../../hooks/useSectionData'
import useAuth from '../../hooks/useAuth'
import { usePortfolio } from '../../contexts/PortfolioProvider'

export default function Skills() {
  const { isAdmin } = useAuth()
  const { invalidatePortfolio } = usePortfolio()
  const { skillGroups, loading, error, refetch } = useSkillsData()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCloseModal = async () => {
    setModalOpen(false)
    await refetch()
    invalidatePortfolio()
  }

  return (
    <AnimatedSection id="skills" className="section-spacing max-w-6xl mx-auto px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="eyebrow text-primary text-sm mb-3 uppercase">// toolkit</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">Skills &amp; tech stack</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm rounded-full gap-2">
            <FiEdit2 className="w-3.5 h-3.5" /> Update Skills &amp; Tech Stack
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-base-300 bg-base-100 p-6 space-y-3 animate-pulse">
              <div className="h-5 w-40 rounded bg-base-300" />
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-16 rounded-full bg-base-300" />
                <div className="h-7 w-20 rounded-full bg-base-300" />
                <div className="h-7 w-14 rounded-full bg-base-300" />
              </div>
            </div>
          ))}
        </div>
      ) : error && skillGroups.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-error">Could not load skills.</p>
          <button type="button" className="btn btn-xs btn-outline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : skillGroups.length === 0 ? (
        <p className="text-sm text-base-content/50">No skills added yet.</p>
      ) : (
        <motion.div
          key={`skills-${skillGroups.map((g) => g._id || g.category).join('-')}`}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {skillGroups.map((group, index) => (
            <motion.div
              key={group._id || `${group.category}-${index}`}
              variants={fadeUp}
              className="rounded-2xl border border-base-300 bg-base-100 p-6 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-display font-semibold text-lg text-base-content mb-3">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {(group.items || []).map((skill) => (
                  <TechSkillBadge key={skill} name={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {isAdmin && modalOpen && (
        <SkillsFormModal type="development" onClose={handleCloseModal} />
      )}
    </AnimatedSection>
  )
}
