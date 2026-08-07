import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2 } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import SkillsFormModal from '../modals/SkillsFormModal'
import TechSkillBadge from '../TechSkillBadge'
import { useProfileData } from '../../contexts/ProfileContext'
import useAuth from '../../hooks/useAuth'

export default function Skills() {
  const { profile } = useProfileData()
  const { isAdmin } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  // Job/developer portfolio shows developmentSkills, not the academic researchSkills split.
  const skillGroups = (profile?.developmentSkills || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0))

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

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGroups.map((group) => (
          <motion.div key={group._id} variants={fadeUp}
            className="rounded-2xl border border-base-300 bg-base-100 p-6 hover:border-primary/40 transition-colors">
            <h3 className="font-display font-semibold text-lg text-base-content mb-3">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <TechSkillBadge key={skill} name={skill} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isAdmin && modalOpen && <SkillsFormModal type="development" onClose={() => setModalOpen(false)} />}
    </AnimatedSection>
  )
}
