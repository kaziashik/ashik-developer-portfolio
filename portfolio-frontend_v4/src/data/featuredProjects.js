/**
 * Static featured projects merged into Selected Work.
 * Live site screenshots live in /public/projects/.
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

/**
 * Merge static featured projects ahead of API list.
 * Showcase trio always wins (proper screenshots + resume-ready copy).
 */
export function mergeFeaturedProjects(apiProjects = []) {
  const list = Array.isArray(apiProjects) ? [...apiProjects] : []
  const withoutShowcaseDupes = list.filter(
    (apiProject) => !STATIC_FEATURED_PROJECTS.some((staticProject) => matchesStatic(apiProject, staticProject))
  )
  return [...STATIC_FEATURED_PROJECTS, ...withoutShowcaseDupes]
}
