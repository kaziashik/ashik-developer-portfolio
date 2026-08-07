import { motion } from 'framer-motion'
import Hero from '../ui/sections/Hero'
import About from '../ui/sections/About'
import Skills from '../ui/sections/Skills'
import Projects from '../ui/sections/Projects'
import Contributions from '../ui/sections/Contributions'
import Experience from '../ui/sections/Experience'
import ContactCTA from '../ui/sections/ContactCTA'

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contributions />
      <ContactCTA />
    </motion.div>
  )
}
