import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiPlus } from 'react-icons/fi'
import AnimatedSection, { staggerContainer } from '../AnimatedSection'
import ProjectCard from '../ProjectCard'
import ProjectFormModal from '../modals/ProjectFormModal'
import { ProjectGridSkeleton } from '../skeletons/SectionCardSkeleton'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { deleteProject, updateProject } from '../../api/projectsApi'
import { usePortfolio } from '../../contexts/PortfolioProvider'
import { useProjectsData } from '../../hooks/useSectionData'
import { getShowcaseKey, mergeFeaturedProjects } from '../../data/featuredProjects'
import { splitFeaturedProjects } from '../../utils/projectHelpers'
import { confirmDelete, isPersistedId, toastError, toastSuccess } from '../../utils/swal'

function sortProjects(merged) {
  const featuredOrder = ['rentnest', 'zapshift', 'gearup']
  return [...merged].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    const ai = featuredOrder.indexOf(String(getShowcaseKey(a) || a._id))
    const bi = featuredOrder.indexOf(String(getShowcaseKey(b) || b._id))
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
  const { profile, invalidatePortfolio } = usePortfolio()
  const { data: apiProjects, loading } = useProjectsData('job')
  const [modalState, setModalState] = useState(null)

  const projects = useMemo(
    () => sortProjects(mergeFeaturedProjects(apiProjects || [])),
    [apiProjects]
  )

  const { featured, rest } = useMemo(() => {
    const split = splitFeaturedProjects(projects)
    // One lead featured card for hierarchy; rest in grid
    return {
      featured: split.featured.slice(0, 1),
      rest: [...split.featured.slice(1), ...split.rest],
    }
  }, [projects])

  const refreshAll = async () => {
    await invalidatePortfolio()
  }

  const handleDelete = async (project) => {
    if (!isPersistedId(project._id)) {
      await toastError('Cannot delete', 'This project is not saved in the database yet.')
      return
    }

    const result = await confirmDelete(`Delete "${project.title}"?`)
    if (!result.isConfirmed) return

    try {
      await deleteProject(axiosSecure, project._id)
      await toastSuccess('Project deleted')
      refreshAll()
    } catch (err) {
      await toastError('Delete failed', err?.response?.data?.message || err.message)
    }
  }

  const handleToggleVisible = async (project) => {
    if (!isPersistedId(project._id)) {
      await toastError('Cannot update visibility', 'Save this project to the database first (Add / seed).')
      return
    }

    const nextPublic = !(project.isPublic !== false)
    try {
      await updateProject(axiosSecure, project._id, { isPublic: nextPublic })
      await toastSuccess(nextPublic ? 'Project visible to visitors' : 'Project hidden from visitors')
      refreshAll()
    } catch (err) {
      await toastError('Could not update visibility', err?.response?.data?.message || err.message)
    }
  }

  const handleEdit = async (project) => {
    if (!isPersistedId(project._id)) {
      await toastError('Cannot update', 'This showcase item is not in the database yet.')
      return
    }
    setModalState(project)
  }

  const cardProps = {
    isAdmin,
    onEdit: handleEdit,
    onToggleVisible: handleToggleVisible,
    onDelete: handleDelete,
  }

  return (
    <AnimatedSection id="projects" className="section-spacing max-w-6xl mx-auto px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow text-primary text-sm mb-3 uppercase">// selected work</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content">Featured projects</h2>
          <p className="mt-3 max-w-xl text-base text-base-content/55">
            Selected full-stack builds — product focus, clean UI, and production-ready APIs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setModalState('add')}
              className="btn btn-outline btn-sm rounded-full gap-1.5"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add project
            </button>
          )}
          {profile?.links?.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="eyebrow text-xs text-base-content/60 hover:text-primary flex items-center gap-1"
            >
              all repositories <FiArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {loading ? (
        <ProjectGridSkeleton cards={3} />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-5"
        >
          {/* Lead featured — full width on large screens */}
          {featured.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              featured
              canManage={isPersistedId(p._id)}
              {...cardProps}
            />
          ))}

          {/* Remaining cards — balanced columns (no empty 3rd slot) */}
          {rest.length > 0 && (
            <div
              className={
                rest.length === 1
                  ? 'grid md:grid-cols-2 gap-5'
                  : rest.length === 2
                    ? 'grid md:grid-cols-2 gap-5'
                    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-5'
              }
            >
              {rest.map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  canManage={isPersistedId(p._id)}
                  {...cardProps}
                />
              ))}
            </div>
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
