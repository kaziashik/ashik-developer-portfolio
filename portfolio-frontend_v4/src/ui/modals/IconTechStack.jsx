import { motion } from 'framer-motion'
import { getTechIconList } from '../../utils/techIcons'

const IconTechStack = ({ compact = false }) => {
  const techStack = getTechIconList()

  return (
    <motion.div
      className={compact ? 'flex flex-wrap gap-2 py-1' : 'flex flex-wrap gap-3 mt-2 py-4'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {techStack.map((tech, index) => {
        const Icon = tech.icon

        return (
          <motion.div
            key={index}
            className="tooltip"
            data-tip={tech.name}
            whileHover={{ scale: 1.2, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={`${compact ? 'text-2xl' : 'text-3xl'} ${tech.className}`} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default IconTechStack
