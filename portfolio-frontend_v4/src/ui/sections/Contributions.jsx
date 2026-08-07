import { motion } from 'framer-motion'
import { FiStar, FiArrowUpRight } from 'react-icons/fi'
import AnimatedSection, { staggerContainer, fadeUp } from '../AnimatedSection'
import { contributions } from '../../utils/data'

export default function Contributions() {
  return (
    <AnimatedSection id="contributions" className="section-spacing max-w-6xl mx-auto px-6">
      <p className="eyebrow text-primary text-sm mb-3 uppercase">// open source</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content mb-10">Contributions</h2>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-2 gap-4">
        {contributions.map((c) => (
          <motion.a key={c.repo} href={c.url} target="_blank" rel="noreferrer" variants={fadeUp}
            className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-primary/40 transition-colors group">
            <div>
              <h3 className="font-display font-semibold text-lg text-base-content mb-1">{c.repo}</h3>
              <p className="text-base text-base-content/70">{c.description}</p>
            </div>
            <div className="flex items-center gap-3 text-base-content/50 eyebrow text-xs shrink-0 pl-4">
              {c.stars && <span className="flex items-center gap-1"><FiStar className="w-3 h-3" /> {c.stars}</span>}
              <FiArrowUpRight className="w-4 h-4 group-hover:text-primary transition-colors" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </AnimatedSection>
  )
}
