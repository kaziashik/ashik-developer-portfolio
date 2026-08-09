/**
 * Static featured projects used as fallback / image enrichment.
 * When a matching API project exists, the DB document wins (real Mongo _id for admin CRUD).
 */
export const STATIC_FEATURED_PROJECTS = [
  {
    _id: 'rentnest',
    title: 'RentNest — Rental Property Marketplace',
    startDate: '2026-05',
    endDate: 'Present',
    toolsUsed: [
      'Next.js',
      'TypeScript',
      'Express.js',
      'Prisma',
      'PostgreSQL',
      'Stripe',
      'JWT',
    ],
    details: [
      'Full-stack rental property marketplace where tenants browse and request homes, landlords manage listings, and admins moderate the platform.',
      'Role-based dashboards for Tenant, Landlord, and Admin with protected routes.',
      'Property search/filter and rental request workflow (pending → approved → active → completed).',
      'Stripe Checkout payments with secure JWT (access + refresh) auth; landlord property CRUD, reviews, and admin moderation.',
      'Role: Solo full-stack — built Next.js frontend and Express/Prisma/PostgreSQL backend; integrated Stripe and REST APIs.',
      'API: https://rentnestbackend.vercel.app/',
    ],
    imageUrls: ['/projects/rentnest.jpg'],
    links: {
      github: 'https://github.com/kaziashik/rentnest_frontend-',
      live: 'https://rentnest-frontend-theta.vercel.app/',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    createdAt: '2026-08-09T03:00:00.000Z',
  },
  {
    _id: 'zapshift',
    title: 'ZapShift — Door-to-Door Parcel Delivery',
    startDate: '2026-06',
    endDate: 'Present',
    toolsUsed: [
      'React',
      'Vite',
      'Express.js',
      'MongoDB',
      'Firebase Auth',
      'Stripe',
      'TanStack Query',
    ],
    details: [
      'Door-to-door parcel delivery platform for Bangladesh with booking, payments, rider assignment, and OTP-confirmed delivery.',
      'Multi-role workflows for User, Admin, and Rider across 64 districts.',
      'Automated pricing (document/non-document, weight, city/outside) with server validation.',
      'Stripe payments + parcel tracking timeline; OTP confirmation on delivery; warehouse handoff for inter-district routes.',
      'Role: Solo full-stack — built React/Vite frontend and Express/MongoDB API; Firebase Auth + Stripe integration.',
      'API: https://zap-shift-server-delta-smoky.vercel.app/',
    ],
    imageUrls: ['/projects/zapshift.jpg'],
    links: {
      github: 'https://github.com/kaziashik/zap-shift',
      live: 'https://zap-shift-737f5.web.app/',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    createdAt: '2026-08-09T02:00:00.000Z',
  },
  {
    _id: 'gearup',
    title: 'GearUp — Sports & Outdoor Gear Rental',
    startDate: '2026-07',
    endDate: 'Present',
    toolsUsed: [
      'Next.js',
      'React',
      'TypeScript',
      'Express.js',
      'Prisma',
      'PostgreSQL',
      'Stripe',
    ],
    details: [
      'Sports and outdoor gear rental marketplace connecting customers, gear providers, and platform admins.',
      'Browse/filter gear, date-based rentals, and Stripe checkout.',
      'Provider dashboard for inventory CRUD and order status (confirm → picked up → returned).',
      'Customer order tracking, payments, and post-rental reviews; admin moderation with JWT cookie auth.',
      'Role: Solo full-stack — built Next.js frontend and Express/Prisma/PostgreSQL backend; Stripe, Google Sign-In, and role-based dashboards.',
      'API: https://gareup.vercel.app',
    ],
    imageUrls: ['/projects/gearup.jpg'],
    links: {
      github: 'https://github.com/kaziashik/GearUp',
      live: 'https://gearupfronted.vercel.app',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    createdAt: '2026-08-09T01:00:00.000Z',
  },
]

function matchesStatic(apiProject, staticProject) {
  const title = apiProject.title || ''
  const live = apiProject.links?.live || ''
  const github = apiProject.links?.github || ''
  const id = String(apiProject._id || '')

  if (id === staticProject._id) return true

  if (staticProject._id === 'rentnest') {
    return /rentnest/i.test(title) || live.includes('rentnest') || github.includes('rentnest')
  }
  if (staticProject._id === 'zapshift') {
    return /zap\s*-?\s*shift/i.test(title) || live.includes('zap-shift') || github.includes('zap-shift')
  }
  if (staticProject._id === 'gearup') {
    return /gearup/i.test(title) || live.includes('gearup') || github.includes('GearUp') || github.includes('gearup')
  }
  return false
}

export function getStaticProjectById(id) {
  return STATIC_FEATURED_PROJECTS.find((p) => p._id === id) || null
}

export function getShowcaseKey(project) {
  if (!project) return null
  if (project._showcaseKey) return project._showcaseKey
  const hit = STATIC_FEATURED_PROJECTS.find((s) => matchesStatic(project, s))
  return hit?._id || null
}

function preferLocalImages(apiImages, staticImages) {
  const first = apiImages?.[0] || ''
  if (!first || first.includes('mshots') || first.includes('placeholder')) {
    return staticImages?.length ? staticImages : apiImages
  }
  return apiImages?.length ? apiImages : staticImages
}

/**
 * Prefer DB projects (real Mongo _ids) when they match a showcase entry.
 * Inject static fallbacks only when no API match exists (marked _isStatic).
 */
export function mergeFeaturedProjects(apiProjects = []) {
  const list = Array.isArray(apiProjects) ? [...apiProjects] : []
  const matchedStaticIds = new Set()

  const fromApi = list.map((apiProject) => {
    const staticMatch = STATIC_FEATURED_PROJECTS.find((s) => matchesStatic(apiProject, s))
    if (!staticMatch) return apiProject

    matchedStaticIds.add(staticMatch._id)
    return {
      ...staticMatch,
      ...apiProject,
      _id: apiProject._id,
      _showcaseKey: staticMatch._id,
      _isStatic: false,
      imageUrls: preferLocalImages(apiProject.imageUrls, staticMatch.imageUrls),
      details: apiProject.details?.length ? apiProject.details : staticMatch.details,
      toolsUsed: apiProject.toolsUsed?.length ? apiProject.toolsUsed : staticMatch.toolsUsed,
      links: {
        ...staticMatch.links,
        ...apiProject.links,
      },
      featured: apiProject.featured ?? staticMatch.featured,
      isPublic: apiProject.isPublic !== false,
    }
  })

  const missingStatic = STATIC_FEATURED_PROJECTS.filter((s) => !matchedStaticIds.has(s._id)).map((s) => ({
    ...s,
    _showcaseKey: s._id,
    _isStatic: true,
  }))

  return [...missingStatic, ...fromApi]
}
