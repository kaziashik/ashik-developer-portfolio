import { motion } from 'framer-motion'
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import { contributions } from '../../utils/data'

export default function Contributions() {
  if (!contributions.length) return null

  return (
    <AnimatedSection id="contributions" className="section-spacing max-w-6xl mx-auto px-6">
      <p className="eyebrow text-primary text-sm mb-3 uppercase">// open source</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content mb-3">
        Contributions
      </h2>
      <p className="mb-10 max-w-2xl text-base text-base-content/60">
        Open-source work and public contributions.
      </p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {contributions.map((c) => (
          <motion.article
            key={c.repo}
            variants={fadeUp}
            className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-base-content">
                  {c.name || c.repo}
                </h3>
                {c.name && <p className="mt-0.5 text-xs text-base-content/45 font-mono">{c.repo}</p>}
              </div>
              <FiGithub className="mt-1 h-5 w-5 shrink-0 text-base-content/40" aria-hidden="true" />
            </div>

            <p className="mb-4 flex-1 text-base leading-relaxed text-base-content/70">{c.description}</p>

            {c.stack?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {c.stack.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline badge-sm eyebrow text-[10px] font-normal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-base-300 pt-4">
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm gap-1.5 rounded-full"
              >
                <FiGithub className="h-3.5 w-3.5" />
                Code
                <FiArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {c.live && (
                <a
                  href={c.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-content"
                >
                  <FiExternalLink className="h-3.5 w-3.5" />
                  Live
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </AnimatedSection>
  )
}
