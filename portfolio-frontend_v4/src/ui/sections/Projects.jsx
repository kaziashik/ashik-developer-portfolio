import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import Swal from 'sweetalert2'
import { FiArrowUpRight, FiGithub, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import ProjectFormModal from '../modals/ProjectFormModal'
import { ProjectGridSkeleton } from '../skeletons/SectionCardSkeleton'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { deleteProject, updateProject } from '../../api/projectsApi'
import { usePortfolio } from '../../contexts/PortfolioProvider'
import { useProjectsData } from '../../hooks/useSectionData'
import { mergeFeaturedProjects } from '../../data/featuredProjects'

function sortProjects(merged) {
  const featuredOrder = ['rentnest', 'zapshift', 'gearup']
  return [...merged].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    const ai = featuredOrder.indexOf(String(a._id))
    const bi = featuredOrder.indexOf(String(b._id))
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
}

export default function Projects() {
  const { isAdmin } = useAuth()
  const axiosSecure = useAxiosSecure()
  const { profile, refetchPortfolio, invalidatePortfolio } = usePortfolio()
  const { data: apiProjects, loading, refetch: refetchProjects } = useProjectsData('job')
  const [modalState, setModalState] = useState(null) // null | 'add' | project object

  const projects = useMemo(
    () => sortProjects(mergeFeaturedProjects(apiProjects || [])),
    [apiProjects]
  )

  const refreshAll = async () => {
    await Promise.all([refetchPortfolio(), refetchProjects()])
    invalidatePortfolio()
  }

  const handleDelete = async (project) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Delete "${project.title}"?`,
      text: 'This cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    })
    if (!result.isConfirmed) return

    try {
      await deleteProject(axiosSecure, project._id)
      await Swal.fire({ icon: 'success', title: 'Project deleted', timer: 1200, showConfirmButton: false })
      refreshAll()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: err?.response?.data?.message || err.message })
    }
  }

  const handleToggleVisible = async (project) => {
    try {
      await updateProject(axiosSecure, project._id, { isPublic: !(project.isPublic !== false) })
      refreshAll()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not update visibility', text: err?.response?.data?.message || err.message })
    }
  }

  return (
    <AnimatedSection id="projects" className="section-spacing max-w-6xl mx-auto px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-primary text-sm mb-3 uppercase">// selected work</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">Featured projects</h2>
        </div>
        {profile?.links?.github && (
          <a href={profile.links.github} target="_blank" rel="noreferrer"
            className="eyebrow text-xs text-base-content/60 hover:text-primary flex items-center gap-1">
            all repositories <FiArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {loading ? (
        <ProjectGridSkeleton cards={3} />
      ) : (
        <motion.div
          key={`projects-${projects.map((p) => p._id).join('-') || 'empty'}`}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-5"
        >
          {projects.map((p) => {
            const hidden = p.isPublic === false
            return (
              <motion.div
                key={p._id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`group relative card bg-base-100 border overflow-hidden transition-shadow hover:shadow-lg cursor-pointer ${hidden ? 'border-warning/50' : 'border-base-300 hover:border-primary/40'}`}
              >
                <Link
                  to={`/projects/${p._id}`}
                  className="absolute inset-0 z-[1]"
                  aria-label={`View ${p.title} details`}
                />

                <div className="aspect-video bg-base-200 flex items-center justify-center text-base-content/40 text-xs eyebrow overflow-hidden relative">
                  {p.imageUrls?.[0] ? (
                    <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  ) : (
                    'project preview'
                  )}
                  {p.featured && !hidden && (
                    <span className="absolute top-2 left-2 badge badge-primary badge-sm eyebrow z-[2]">Featured</span>
                  )}
                  {isAdmin && hidden && (
                    <span className="absolute top-2 left-2 badge badge-warning badge-sm eyebrow z-[2]">Hidden from visitors</span>
                  )}
                </div>
                <div className="card-body p-5">
                  <h3 className="font-display font-semibold text-lg text-base-content mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-base text-base-content/70 mb-4 line-clamp-3">{p.details?.[0]}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(p.toolsUsed || []).map((tag) => (
                      <span key={tag} className="badge badge-outline badge-sm eyebrow text-[10px]">{tag}</span>
                    ))}
                  </div>

                  <div className="relative z-[2] flex flex-wrap gap-2 mt-auto">
                    {p.links?.live && (
                      <a href={p.links.live} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline gap-1">
                        <FiArrowUpRight className="w-3 h-3" /> Live Demo
                      </a>
                    )}
                    {p.links?.github && (
                      <a href={p.links.github} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline gap-1">
                        <FiGithub className="w-3 h-3" /> GitHub
                      </a>
                    )}
                    <span className="btn btn-xs btn-primary gap-1 pointer-events-none">
                      Overview
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="relative z-[2] flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
                      <button onClick={() => setModalState(p)} className="btn btn-xs btn-ghost gap-1">
                        <FiEdit2 className="w-3 h-3" /> Update
                      </button>
                      <button onClick={() => handleToggleVisible(p)} className="btn btn-xs btn-ghost gap-1">
                        {hidden ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />}
                        {hidden ? 'Show to Visitors' : 'Hide from Visitors'}
                      </button>
                      <button onClick={() => handleDelete(p)} className="btn btn-xs btn-ghost text-error gap-1">
                        <FiTrash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {isAdmin && (
            <motion.button
              variants={fadeUp}
              onClick={() => setModalState('add')}
              className="card border-2 border-dashed border-base-300 hover:border-primary/50 flex items-center justify-center min-h-[280px] text-base-content/50 hover:text-primary transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <FiPlus className="w-8 h-8" />
                <span className="eyebrow text-xs uppercase">Add New Project</span>
              </div>
            </motion.button>
          )}
        </motion.div>
      )}

      {isAdmin && modalState && (
        <ProjectFormModal
          project={modalState === 'add' ? null : modalState}
          onClose={() => setModalState(null)}
          onSaved={refreshAll}
        />
      )}
    </AnimatedSection>
  )
}
