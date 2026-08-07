import { motion } from 'framer-motion'
import { getTechIcon } from '../utils/techIcons'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const iconItem = {
  hidden: { opacity: 0, y: 10, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HeroTechStack({ skills = [] }) {
  const techItems = skills
    .map((name) => {
      const tech = getTechIcon(name)
      if (!tech) return null
      return { name, icon: tech.icon, className: tech.className }
    })
    .filter(Boolean)

  if (!techItems.length) return null

  return (
    <div className="mb-8 max-w-xl">
      <p className="eyebrow text-primary text-[11px] uppercase tracking-[0.2em] mb-3">Tech stack</p>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center gap-3.5 md:gap-4"
      >
        {techItems.map(({ name, icon: Icon, className }) => (
          <motion.div
            key={name}
            variants={iconItem}
            className="tooltip tooltip-top"
            data-tip={name}
            whileHover={{ scale: 1.12, y: -4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 20 }}
          >
            <Icon className={`text-3xl md:text-[2rem] ${className || ''}`} aria-label={name} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
