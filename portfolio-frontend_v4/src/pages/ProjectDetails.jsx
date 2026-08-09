import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft, FiArrowUpRight, FiGithub, FiFileText } from 'react-icons/fi'
import useAxios from '../hooks/useAxios'
import { getProjectById } from '../api/projectsApi'
import { getStaticProjectById } from '../data/featuredProjects'
import { optimizeImageUrl } from '../utils/imageUrl'
import PageLoader from '../ui/skeletons/PageLoader'

export default function ProjectDetails() {
  const { id } = useParams()
  const axiosPublic = useAxios()
  const staticProject = getStaticProjectById(id)

  const { data: apiProject, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(axiosPublic, id),
    staleTime: 5 * 60 * 1000,
    enabled: !staticProject,
  })

  const project = staticProject || apiProject

  if (!staticProject && isLoading) {
    return <PageLoader />
  }

  if ((!staticProject && isError) || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-base-content/60">Project not found.</p>
        <Link to="/#projects" className="btn btn-outline rounded-full">Back to projects</Link>
      </div>
    )
  }

  const heroImage = optimizeImageUrl(project.imageUrls?.[0], { width: 1200 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen pt-24 pb-12 page-container"
    >
      <Link to="/#projects" className="eyebrow text-xs text-base-content/50 hover:text-primary flex items-center gap-1 mb-8">
        <FiArrowLeft className="w-3.5 h-3.5" /> Back to projects
      </Link>

      <p className="eyebrow text-primary text-xs mb-3 uppercase">
        {project.startDate} — {project.endDate}
      </p>
      <h1 className="font-display text-3xl md:text-5xl font-bold text-base-content mb-6">{project.title}</h1>

      {heroImage && (
        <div className="rounded-2xl overflow-hidden border border-base-300 mb-8 aspect-video bg-base-200">
          <img
            src={heroImage}
            alt={project.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {(project.toolsUsed || []).map((tag) => (
          <span key={tag} className="badge badge-outline eyebrow text-xs">{tag}</span>
        ))}
      </div>

      <div className="prose max-w-none text-base-content/80 mb-10">
        <ul className="space-y-2 list-disc list-inside">
          {(project.details || []).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      {project.imageUrls?.length > 1 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {project.imageUrls.slice(1).map((url, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-base-300 aspect-video bg-base-200">
              <img
                src={optimizeImageUrl(url, { width: 800 })}
                alt={`${project.title} screenshot ${i + 2}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {project.links?.live && (
          <a href={project.links.live} target="_blank" rel="noreferrer" className="btn btn-primary rounded-full gap-2">
            <FiArrowUpRight className="w-4 h-4" /> Live Demo
          </a>
        )}
        {project.links?.github && (
          <a href={project.links.github} target="_blank" rel="noreferrer" className="btn btn-outline rounded-full gap-2">
            <FiGithub className="w-4 h-4" /> GitHub
          </a>
        )}
        {project.links?.paper && (
          <a href={project.links.paper} target="_blank" rel="noreferrer" className="btn btn-outline rounded-full gap-2">
            <FiFileText className="w-4 h-4" /> Paper
          </a>
        )}
      </div>
    </motion.div>
  )
}
