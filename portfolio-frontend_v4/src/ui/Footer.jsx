import { Link } from 'react-router'
import { useProfileData } from '../contexts/ProfileContext'
import { SOCIAL_LINKS } from '../config/site'

export default function Footer() {
  const { profile } = useProfileData()
  const socials = {
    github: profile?.links?.github || SOCIAL_LINKS.github,
    linkedin: profile?.links?.linkedin || SOCIAL_LINKS.linkedin,
    email: profile?.email || '',
  }
  const name = profile?.name || 'Kazi Ashik'

  return (
    <footer className="border-t border-base-300 py-8 mt-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm eyebrow text-base-content/50 uppercase">
        <p>&copy; {new Date().getFullYear()} {name}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
          {socials.email ? (
            <a href={`mailto:${socials.email}`} className="hover:text-primary">Email</a>
          ) : (
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          )}
        </div>
      </div>
    </footer>
  )
}
