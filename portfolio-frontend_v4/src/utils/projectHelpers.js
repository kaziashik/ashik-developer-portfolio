export function getProjectImpact(project) {
  const detail = project?.details?.[0]?.trim()
  if (detail) return detail
  const tools = (project?.toolsUsed || []).slice(0, 4).join(' · ')
  return tools ? `Built with ${tools}` : 'Full-stack application'
}

export function splitFeaturedProjects(projects) {
  const list = projects || []
  const flagged = list.filter((p) => p.featured)
  const featured = (flagged.length > 0 ? flagged : list).slice(0, 2)
  const featuredIds = new Set(featured.map((p) => p._id))
  const rest = list.filter((p) => !featuredIds.has(p._id))
  return { featured, rest }
}
