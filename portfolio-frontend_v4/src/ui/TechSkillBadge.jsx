import { getTechIcon } from '../utils/techIcons'

export default function TechSkillBadge({ name }) {
  const tech = getTechIcon(name)
  const Icon = tech?.icon

  return (
    <span className="badge badge-outline gap-2 py-3 px-3.5 font-mono text-xs uppercase tracking-wide">
      {Icon ? (
        <Icon className={`w-5 h-5 shrink-0 ${tech.className || ''}`} aria-hidden="true" />
      ) : null}
      {name}
    </span>
  )
}
