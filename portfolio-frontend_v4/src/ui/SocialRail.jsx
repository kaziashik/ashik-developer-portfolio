import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { useProfileData } from '../contexts/ProfileContext'
import { SITE_BRAND, SOCIAL_LINKS } from '../config/site'

export default function SocialRail() {
  const { profile } = useProfileData()

  const links = [
    { href: profile?.links?.github || SOCIAL_LINKS.github, label: 'GitHub', icon: FiGithub },
    { href: profile?.links?.linkedin || SOCIAL_LINKS.linkedin, label: 'LinkedIn', icon: FiLinkedin },
    { href: profile?.email ? `mailto:${profile.email}` : null, label: 'Email', icon: FiMail },
  ].filter((l) => l.href)

  if (links.length === 0) return null

  return (
    <aside
      aria-label="Social links"
      className="social-rail fixed left-0 top-0 z-40 hidden h-full w-16 flex-col items-center justify-center border-r border-base-300 bg-base-100/60 py-16 backdrop-blur-sm md:flex"
    >
      <ul className="flex flex-col items-center gap-8">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={label}
              className="block text-base-content/45 transition-colors duration-300 hover:text-primary"
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </li>
        ))}
      </ul>

      <span
        aria-hidden="true"
        className="social-rail-brand absolute bottom-16 left-1/2 -translate-x-1/2 rotate-180 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-base-content/45 [writing-mode:vertical-lr]"
      >
        {SITE_BRAND}
      </span>
    </aside>
  )
}
