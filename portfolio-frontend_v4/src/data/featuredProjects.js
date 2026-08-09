/**
 * Static featured projects merged into Selected Work.
 * Kept in sync when admin CMS entry is not yet available.
 */
export const STATIC_FEATURED_PROJECTS = [
  {
    _id: 'zapshift',
    title: 'ZapShift — Door-to-Door Parcel Delivery',
    startDate: '2026-06',
    endDate: 'Present',
    toolsUsed: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Express.js',
      'MongoDB',
      'Firebase Auth',
      'Stripe',
    ],
    details: [
      'Full-stack courier platform for booking, secure payment, rider assignment, and live parcel tracking across Bangladesh.',
      'Role-based dashboards for users, admins, and riders with OTP-confirmed delivery and district coverage maps.',
      'Dynamic pricing by parcel type, weight, and same-city vs inter-district routes with unique PRCL tracking IDs.',
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    ],
    links: {
      github: 'https://github.com/kaziashik/zap-shift',
      live: 'https://zap-shift-737f5.web.app/',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    createdAt: '2026-08-09T00:00:00.000Z',
  },
]

export function getStaticProjectById(id) {
  return STATIC_FEATURED_PROJECTS.find((p) => p._id === id) || null
}

/** Merge static featured projects ahead of API list (skip duplicates by live/github/title). */
export function mergeFeaturedProjects(apiProjects = []) {
  const list = Array.isArray(apiProjects) ? [...apiProjects] : []
  const hasZap = list.some(
    (p) =>
      /zapshift/i.test(p.title || '') ||
      p.links?.live?.includes('zap-shift') ||
      p.links?.github?.includes('zap-shift')
  )
  if (hasZap) return list
  return [...STATIC_FEATURED_PROJECTS, ...list]
}
