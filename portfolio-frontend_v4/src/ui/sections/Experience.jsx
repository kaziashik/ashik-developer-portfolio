import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiMapPin, FiCalendar, FiBookOpen, FiBriefcase } from 'react-icons/fi'
import { confirmDelete, toastError, toastSuccess } from '../../utils/swal'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import ExperienceFormModal from '../modals/ExperienceFormModal'
import EducationFormModal from '../modals/EducationFormModal'
import { TimelineSkeleton } from '../skeletons/SectionCardSkeleton'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { usePortfolio } from '../../contexts/PortfolioProvider'
import { useEducationData, useExperiencesData } from '../../hooks/useSectionData'
import { deleteExperience, updateExperience } from '../../api/experienceApi'
import { deleteEducation, updateEducation } from '../../api/educationApi'

function AdminActions({ hidden, onEdit, onToggle, onDelete }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-base-300/80">
      {hidden && <span className="badge badge-warning badge-sm eyebrow">Hidden</span>}
      <button type="button" onClick={onEdit} className="btn btn-ghost btn-xs gap-1">
        <FiEdit2 className="w-3 h-3" /> Update
      </button>
      <button type="button" onClick={onToggle} className="btn btn-ghost btn-xs gap-1">
        {hidden ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />} {hidden ? 'Show' : 'Hide'}
      </button>
      <button type="button" onClick={onDelete} className="btn btn-ghost btn-xs text-error gap-1">
        <FiTrash2 className="w-3 h-3" /> Delete
      </button>
    </div>
  )
}

function DateBadge({ startDate, endDate }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
      <FiCalendar className="h-3 w-3 shrink-0" aria-hidden="true" />
      {startDate} — {endDate}
    </span>
  )
}

export default function Experience() {
  const { isAdmin } = useAuth()
  const axiosSecure = useAxiosSecure()
  const { invalidatePortfolio } = usePortfolio()
  const {
    data: experiences,
    loading: expLoading,
    error: expError,
    refetch: refetchExp,
  } = useExperiencesData('job')
  const {
    data: education,
    loading: eduLoading,
    error: eduError,
    refetch: refetchEdu,
  } = useEducationData('job')

  const [expModalState, setExpModalState] = useState(null)
  const [eduModalState, setEduModalState] = useState(null)

  const refreshAll = async () => {
    await invalidatePortfolio()
  }

  const handleDeleteExperience = async (exp) => {
    const result = await confirmDelete(`Delete "${exp.role}"?`)
    if (!result.isConfirmed) return
    try {
      await deleteExperience(axiosSecure, exp._id)
      await toastSuccess('Experience deleted')
      refreshAll()
    } catch (err) {
      await toastError('Delete failed', err?.response?.data?.message || err.message)
    }
  }

  const handleToggleExperienceVisible = async (exp) => {
    const nextPublic = !(exp.isPublic !== false)
    try {
      await updateExperience(axiosSecure, exp._id, { isPublic: nextPublic })
      await toastSuccess(nextPublic ? 'Experience visible to visitors' : 'Experience hidden from visitors')
      refreshAll()
    } catch (err) {
      await toastError('Could not update visibility', err?.response?.data?.message || err.message)
    }
  }

  const handleDeleteEducation = async (ed) => {
    const result = await confirmDelete(`Delete "${ed.degree}"?`)
    if (!result.isConfirmed) return
    try {
      await deleteEducation(axiosSecure, ed._id)
      await toastSuccess('Education deleted')
      refreshAll()
    } catch (err) {
      await toastError('Delete failed', err?.response?.data?.message || err.message)
    }
  }

  const handleToggleEducationVisible = async (ed) => {
    const nextPublic = !(ed.isPublic !== false)
    try {
      await updateEducation(axiosSecure, ed._id, { isPublic: nextPublic })
      await toastSuccess(nextPublic ? 'Education visible to visitors' : 'Education hidden from visitors')
      refreshAll()
    } catch (err) {
      await toastError('Could not update visibility', err?.response?.data?.message || err.message)
    }
  }

  return (
    <AnimatedSection id="experience" className="section-spacing max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 lg:gap-12">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow text-primary text-sm mb-3 uppercase">// career</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content flex items-center gap-3">
              <span className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-primary">
                <FiBriefcase className="h-5 w-5" aria-hidden="true" />
              </span>
              Experience
            </h2>
          </div>
          {isAdmin && (
            <button onClick={() => setExpModalState('add')} className="btn btn-outline btn-sm rounded-full gap-1">
              <FiPlus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>

        {expLoading ? (
          <TimelineSkeleton rows={2} />
        ) : expError && experiences.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-error">Could not load experience.</p>
            <button type="button" className="btn btn-xs btn-outline" onClick={() => refetchExp()}>Retry</button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="relative space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-base-300"
          >
            {experiences.length === 0 ? (
              <p className="text-sm text-base-content/50">No experience entries yet.</p>
            ) : (
              experiences.map((exp) => {
                const hidden = exp.isPublic === false
                return (
                  <motion.div
                    key={exp._id}
                    variants={fadeUp}
                    className={`relative rounded-xl border bg-base-100/80 p-5 pl-12 shadow-sm ${
                      hidden ? 'border-warning/40' : 'border-base-300'
                    }`}
                  >
                    <span className="absolute left-[7px] top-6 z-10 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-base-100" />
                    <div className="mb-3">
                      <DateBadge startDate={exp.startDate} endDate={exp.endDate} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-base-content leading-snug">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">{exp.organization}</p>
                    {exp.location && (
                      <p className="mt-1.5 mb-3 inline-flex items-center gap-1.5 text-sm text-base-content/60">
                        <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {exp.location}
                      </p>
                    )}
                    {(exp.highlights || []).length > 0 && (
                      <ul className="mt-3 space-y-2.5">
                        {(exp.highlights || []).map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-base-content/75">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isAdmin && (
                      <AdminActions
                        hidden={hidden}
                        onEdit={() => setExpModalState(exp)}
                        onToggle={() => handleToggleExperienceVisible(exp)}
                        onDelete={() => handleDeleteExperience(exp)}
                      />
                    )}
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow text-primary text-sm mb-3 uppercase">// education</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content flex items-center gap-3">
              <span className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-primary">
                <FiBookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              Education
            </h2>
          </div>
          {isAdmin && (
            <button onClick={() => setEduModalState('add')} className="btn btn-outline btn-sm rounded-full gap-1">
              <FiPlus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>

        {eduLoading ? (
          <TimelineSkeleton rows={1} />
        ) : eduError && education.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-error">Could not load education.</p>
            <button type="button" className="btn btn-xs btn-outline" onClick={() => refetchEdu()}>Retry</button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="relative space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-base-300"
          >
            {education.length === 0 ? (
              <p className="text-sm text-base-content/50">No education entries yet.</p>
            ) : (
              education.map((ed) => {
                const hidden = ed.isPublic === false
                return (
                  <motion.div
                    key={ed._id}
                    variants={fadeUp}
                    className={`relative rounded-xl border bg-base-100/80 p-5 pl-12 shadow-sm ${
                      hidden ? 'border-warning/40' : 'border-base-300'
                    }`}
                  >
                    <span className="absolute left-[7px] top-6 z-10 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-base-100" />
                    <div className="mb-3">
                      <DateBadge startDate={ed.startDate} endDate={ed.endDate} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-base-content leading-snug">
                      {ed.degree}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">{ed.institution}</p>
                    {ed.gpa && (
                      <p className="mt-3 inline-flex rounded-md border border-base-300 bg-base-200/60 px-2.5 py-1 text-sm text-base-content/70">
                        GPA: {ed.gpa}
                      </p>
                    )}
                    {isAdmin && (
                      <AdminActions
                        hidden={hidden}
                        onEdit={() => setEduModalState(ed)}
                        onToggle={() => handleToggleEducationVisible(ed)}
                        onDelete={() => handleDeleteEducation(ed)}
                      />
                    )}
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </div>

      {isAdmin && expModalState && (
        <ExperienceFormModal
          experience={expModalState === 'add' ? null : expModalState}
          onClose={() => setExpModalState(null)}
          onSaved={refreshAll}
        />
      )}
      {isAdmin && eduModalState && (
        <EducationFormModal
          education={eduModalState === 'add' ? null : eduModalState}
          onClose={() => setEduModalState(null)}
          onSaved={refreshAll}
        />
      )}
    </AnimatedSection>
  )
}
