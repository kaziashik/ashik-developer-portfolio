import { motion } from 'framer-motion'

// Fade + slide-up wrapper used by every section so content animates in as it scrolls into view.
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

export default function AnimatedSection({ id, className, children }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  )
}
