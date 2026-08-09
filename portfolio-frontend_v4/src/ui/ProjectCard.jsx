import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiArrowRight, FiArrowUpRight, FiGithub, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import { fadeUp } from './AnimatedSection'
import { optimizeImageUrl } from '../utils/imageUrl'
import { getProjectImpact } from '../utils/projectHelpers'

export default function ProjectCard({
  project,
  featured = false,
  isAdmin,
  canManage = true,
  onEdit,
  onToggleVisible,
  onDelete,
}) {
  const hidden = project.isPublic === false
  const imageUrl = optimizeImageUrl(project.imageUrls?.[0], { width: featured ? 1200 : 800 })
  const impact = getProjectImpact(project)

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: featured ? -4 : -6 }}
      className={`group relative card bg-base-100 border overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        hidden ? 'border-warning/50' : 'border-base-300 hover:border-primary/40'
      } ${featured ? 'lg:flex lg:flex-row' : ''}`}
    >
      <Link
        to={`/projects/${project._id}`}
        className="absolute inset-0 z-[1]"
        aria-label={`View ${project.title} details`}
      />

      <div
        className={`bg-base-200 flex items-center justify-center text-base-content/40 text-xs eyebrow overflow-hidden relative shrink-0 ${
          featured
            ? 'aspect-video lg:w-[48%] lg:aspect-auto lg:min-h-[300px] xl:min-h-[340px]'
            : 'aspect-video'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="px-4 text-center">Add a screenshot in admin</span>
        )}
        {featured && !hidden && (
          <span className="absolute top-3 left-3 badge badge-primary badge-sm eyebrow z-[2]">Featured</span>
        )}
        {isAdmin && hidden && (
          <span className="absolute top-2 left-2 badge badge-warning badge-sm eyebrow z-[2]">Hidden</span>
        )}
      </div>

      <div className={`card-body flex flex-col ${featured ? 'lg:w-[52%] lg:justify-center' : ''} p-5 ${featured ? 'lg:p-8 xl:p-10' : ''}`}>
        <h3 className={`font-display font-semibold text-base-content mb-2 group-hover:text-primary transition-colors ${featured ? 'text-xl lg:text-2xl xl:text-3xl' : 'text-lg'}`}>
          {project.title}
        </h3>
        <p className={`text-base-content/70 mb-4 leading-relaxed ${featured ? 'text-base lg:text-lg line-clamp-3 lg:line-clamp-4' : 'text-base line-clamp-3'}`}>
          {impact}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.toolsUsed || []).slice(0, featured ? 7 : 5).map((tag) => (
            <span key={tag} className="badge badge-outline badge-sm eyebrow text-[10px]">
              {tag}
            </span>
          ))}
        </div>

        <div className="relative z-[2] flex flex-wrap gap-2.5 mt-auto">
          <Link to={`/projects/${project._id}`} className="btn btn-sm btn-primary gap-1.5 px-3.5">
            View project <FiArrowRight className="w-4 h-4" />
          </Link>
          {project.links?.live && (
            <a href={project.links.live} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline gap-1.5 px-3.5">
              <FiArrowUpRight className="w-4 h-4" /> Live
            </a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline gap-1.5 px-3.5">
              <FiGithub className="w-4 h-4" /> Code
            </a>
          )}
        </div>

        {isAdmin && (
          <div className="relative z-[2] flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
            {canManage ? (
              <>
                <button type="button" onClick={() => onEdit?.(project)} className="btn btn-ghost btn-xs gap-1">
                  <FiEdit2 className="w-3 h-3" /> Update
                </button>
                <button type="button" onClick={() => onToggleVisible?.(project)} className="btn btn-ghost btn-xs gap-1">
                  {hidden ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />}
                  {hidden ? 'Show' : 'Hide'}
                </button>
                <button type="button" onClick={() => onDelete?.(project)} className="btn btn-ghost btn-xs text-error gap-1">
                  <FiTrash2 className="w-3 h-3" /> Delete
                </button>
              </>
            ) : (
              <p className="text-xs text-warning">Showcase only — add via admin to enable CRUD.</p>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
