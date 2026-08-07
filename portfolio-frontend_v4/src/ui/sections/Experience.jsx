import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import ExperienceFormModal from '../modals/ExperienceFormModal'
import EducationFormModal from '../modals/EducationFormModal'
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { getExperiences, getAllExperiencesForAdmin, deleteExperience, updateExperience } from '../../api/experienceApi'
import { getEducation, getAllEducationForAdmin, deleteEducation, updateEducation } from '../../api/educationApi'

const byNewestFirst = (list) =>
  [...(list || [])].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

export default function Experience() {
  const { isAdmin } = useAuth()
  const axiosPublic = useAxios()
  const axiosSecure = useAxiosSecure()

  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [expModalState, setExpModalState] = useState(null) // null | 'add' | item
  const [eduModalState, setEduModalState] = useState(null)

  const loadExperience = useCallback(async () => {
    try {
      const data = isAdmin
        ? await getAllExperiencesForAdmin(axiosSecure, { visibility: 'job' })
        : await getExperiences(axiosPublic, { visibility: 'job' })
      setExperience(byNewestFirst(data))
    } catch (err) {
      console.error('Failed to load experience:', err.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const loadEducation = useCallback(async () => {
    try {
      const data = isAdmin
        ? await getAllEducationForAdmin(axiosSecure, { visibility: 'job' })
        : await getEducation(axiosPublic, { visibility: 'job' })
      setEducation(byNewestFirst(data))
    } catch (err) {
      console.error('Failed to load education:', err.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  useEffect(() => {
    loadExperience()
    loadEducation()
  }, [loadExperience, loadEducation])

  const handleDeleteExperience = async (exp) => {
    const result = await Swal.fire({ icon: 'warning', title: `Delete "${exp.role}"?`, showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#dc2626' })
    if (!result.isConfirmed) return
    try {
      await deleteExperience(axiosSecure, exp._id)
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false })
      loadExperience()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.response?.data?.message || err.message })
    }
  }

  const handleToggleExperienceVisible = async (exp) => {
    try {
      await updateExperience(axiosSecure, exp._id, { isPublic: !(exp.isPublic !== false) })
      loadExperience()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not update visibility', text: err?.response?.data?.message || err.message })
    }
  }

  const handleDeleteEducation = async (ed) => {
    const result = await Swal.fire({ icon: 'warning', title: `Delete "${ed.degree}"?`, showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#dc2626' })
    if (!result.isConfirmed) return
    try {
      await deleteEducation(axiosSecure, ed._id)
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false })
      loadEducation()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.response?.data?.message || err.message })
    }
  }

  const handleToggleEducationVisible = async (ed) => {
    try {
      await updateEducation(axiosSecure, ed._id, { isPublic: !(ed.isPublic !== false) })
      loadEducation()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not update visibility', text: err?.response?.data?.message || err.message })
    }
  }

  return (
    <AnimatedSection id="experience" className="section-spacing max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
      {/* Experience column */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow text-primary text-sm mb-3 uppercase">// career</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">Experience</h2>
          </div>
          {isAdmin && (
            <button onClick={() => setExpModalState('add')} className="btn btn-outline btn-sm rounded-full gap-1">
              <FiPlus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="space-y-8">
          {experience.map((exp) => {
            const hidden = exp.isPublic === false
            return (
              <motion.div key={exp._id} variants={fadeUp} className={`border-l-2 pl-5 relative ${hidden ? 'border-warning/50' : 'border-base-300'}`}>
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 bg-primary rounded-full" />
                <p className="eyebrow text-xs text-base-content/50 uppercase mb-1">{exp.startDate} — {exp.endDate}</p>
                <h3 className="font-display font-semibold text-lg text-base-content">{exp.role} · {exp.organization}</h3>
                <p className="text-sm text-base-content/50 mb-2">{exp.location}</p>
                <ul className="text-base text-base-content/70 space-y-1 list-disc list-inside">
                  {(exp.highlights || []).map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hidden && <span className="badge badge-warning badge-sm eyebrow">Hidden</span>}
                    <button onClick={() => setExpModalState(exp)} className="btn btn-ghost btn-xs gap-1"><FiEdit2 className="w-3 h-3" /> Update</button>
                    <button onClick={() => handleToggleExperienceVisible(exp)} className="btn btn-ghost btn-xs gap-1">
                      {hidden ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />} {hidden ? 'Show' : 'Hide'}
                    </button>
                    <button onClick={() => handleDeleteExperience(exp)} className="btn btn-ghost btn-xs text-error gap-1"><FiTrash2 className="w-3 h-3" /> Delete</button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Education column */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow text-primary text-sm mb-3 uppercase">// education</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">Education</h2>
          </div>
          {isAdmin && (
            <button onClick={() => setEduModalState('add')} className="btn btn-outline btn-sm rounded-full gap-1">
              <FiPlus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="space-y-8">
          {education.map((ed) => {
            const hidden = ed.isPublic === false
            return (
              <motion.div key={ed._id} variants={fadeUp} className={`border-l-2 pl-5 relative ${hidden ? 'border-warning/50' : 'border-base-300'}`}>
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 bg-primary rounded-full" />
                <p className="eyebrow text-xs text-base-content/50 uppercase mb-1">{ed.startDate} — {ed.endDate}</p>
                <h3 className="font-display font-semibold text-lg text-base-content">{ed.degree}</h3>
                <p className="text-sm text-base-content/50 mb-2">{ed.institution}</p>
                {ed.gpa && <p className="text-base text-base-content/70">GPA: {ed.gpa}</p>}
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hidden && <span className="badge badge-warning badge-sm eyebrow">Hidden</span>}
                    <button onClick={() => setEduModalState(ed)} className="btn btn-ghost btn-xs gap-1"><FiEdit2 className="w-3 h-3" /> Update</button>
                    <button onClick={() => handleToggleEducationVisible(ed)} className="btn btn-ghost btn-xs gap-1">
                      {hidden ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />} {hidden ? 'Show' : 'Hide'}
                    </button>
                    <button onClick={() => handleDeleteEducation(ed)} className="btn btn-ghost btn-xs text-error gap-1"><FiTrash2 className="w-3 h-3" /> Delete</button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {isAdmin && expModalState && (
        <ExperienceFormModal
          experience={expModalState === 'add' ? null : expModalState}
          onClose={() => setExpModalState(null)}
          onSaved={loadExperience}
        />
      )}
      {isAdmin && eduModalState && (
        <EducationFormModal
          education={eduModalState === 'add' ? null : eduModalState}
          onClose={() => setEduModalState(null)}
          onSaved={loadEducation}
        />
      )}
    </AnimatedSection>
  )
}
