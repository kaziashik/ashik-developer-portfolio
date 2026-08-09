import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { motion } from 'framer-motion'
import Hero from '../ui/sections/Hero'
import About from '../ui/sections/About'
import Skills from '../ui/sections/Skills'
import Projects from '../ui/sections/Projects'
import Contributions from '../ui/sections/Contributions'
import Experience from '../ui/sections/Experience'
import ContactCTA from '../ui/sections/ContactCTA'

function scrollToSection(id) {
  if (!id) return
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (tries < 20) {
      tries += 1
      window.setTimeout(tick, 50)
    }
  }
  tick()
}

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const fromState = location.state?.scrollTo
    const fromHash = location.hash?.replace(/^#/, '')
    const target = fromState || fromHash
    if (target) scrollToSection(target)
  }, [location.state, location.hash])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
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
