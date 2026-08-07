import { FiArrowRight } from 'react-icons/fi'
import AnimatedSection from '../AnimatedSection'

export default function ContactCTA() {
  return (
    <AnimatedSection className="section-spacing max-w-6xl mx-auto px-6 pb-8">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-10 md:p-16 text-center">
        <p className="eyebrow text-primary text-sm mb-4 uppercase">// let's talk</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-base-content mb-6">Have a project in mind?</h2>
        <p className="text-base md:text-lg text-base-content/70 max-w-xl mx-auto mb-8">
          Whether it's a role, a freelance project, or just a technical question — I'd like to hear from you.
        </p>
        <a href="/contact" className="btn btn-primary rounded-full">
          Contact me <FiArrowRight className="w-4 h-4" />
        </a>
      </div>
    </AnimatedSection>
  )
}
