/**
 * Upsert RentNest, ZapShift, and GearUp into Featured projects via live admin API.
 * Usage: node --env-file=.env scripts/seed-featured-projects-api.mjs
 *
 * Requires ADMIN_EMAIL + ADMIN_PASSWORD (and optional PORTFOLIO_API_URL).
 */
const API = process.env.PORTFOLIO_API_URL || 'https://ashikprotfoliobackand.vercel.app';
const email = String(process.env.ADMIN_EMAIL || '').trim().replace(/^['"]|['"]$/g, '');
const password = String(process.env.ADMIN_PASSWORD || '').trim().replace(/^['"]|['"]$/g, '');

if (!email || !password) {
  console.error('ADMIN_EMAIL / ADMIN_PASSWORD missing');
  process.exit(1);
}

/** Prefer hosted screenshot URLs if you upload public/projects/*.jpg to Firebase/CDN later. */
const projects = [
  {
    title: 'RentNest — Rental Property Marketplace',
    startDate: '2026-05',
    endDate: 'Present',
    toolsUsed: ['Next.js', 'TypeScript', 'Express.js', 'Prisma', 'PostgreSQL', 'Stripe', 'JWT'],
    details: [
      'Full-stack rental property marketplace where tenants browse and request homes, landlords manage listings, and admins moderate the platform.',
      'Role-based dashboards for Tenant, Landlord, and Admin with protected routes.',
      'Property search/filter and rental request workflow (pending → approved → active → completed).',
      'Stripe Checkout payments with secure JWT (access + refresh) auth; landlord property CRUD, reviews, and admin moderation.',
      'Role: Solo full-stack — built Next.js frontend and Express/Prisma/PostgreSQL backend; integrated Stripe and REST APIs.',
      'API: https://rentnestbackend.vercel.app/',
    ],
    imageUrls: [
      'https://s0.wp.com/mshots/v1/https%3A%2F%2Frentnest-frontend-theta.vercel.app%2F?w=1280',
    ],
    links: {
      github: 'https://github.com/kaziashik/rentnest_frontend-',
      live: 'https://rentnest-frontend-theta.vercel.app/',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    match: (p) =>
      /rentnest/i.test(p.title || '') ||
      p.links?.live?.includes('rentnest') ||
      p.links?.github?.includes('rentnest'),
  },
  {
    title: 'ZapShift — Door-to-Door Parcel Delivery',
    startDate: '2026-06',
    endDate: 'Present',
    toolsUsed: ['React', 'Vite', 'Express.js', 'MongoDB', 'Firebase Auth', 'Stripe', 'TanStack Query'],
    details: [
      'Door-to-door parcel delivery platform for Bangladesh with booking, payments, rider assignment, and OTP-confirmed delivery.',
      'Multi-role workflows for User, Admin, and Rider across 64 districts.',
      'Automated pricing (document/non-document, weight, city/outside) with server validation.',
      'Stripe payments + parcel tracking timeline; OTP confirmation on delivery; warehouse handoff for inter-district routes.',
      'Role: Solo full-stack — built React/Vite frontend and Express/MongoDB API; Firebase Auth + Stripe integration.',
      'API: https://zap-shift-server-delta-smoky.vercel.app/',
    ],
    imageUrls: [
      'https://s0.wp.com/mshots/v1/https%3A%2F%2Fzap-shift-737f5.web.app%2F?w=1280',
    ],
    links: {
      github: 'https://github.com/kaziashik/zap-shift',
      live: 'https://zap-shift-737f5.web.app/',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    match: (p) =>
      /zap\s*-?\s*shift/i.test(p.title || '') ||
      p.links?.live?.includes('zap-shift') ||
      p.links?.github?.includes('zap-shift'),
  },
  {
    title: 'GearUp — Sports & Outdoor Gear Rental',
    startDate: '2026-07',
    endDate: 'Present',
    toolsUsed: ['Next.js', 'React', 'TypeScript', 'Express.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    details: [
      'Sports and outdoor gear rental marketplace connecting customers, gear providers, and platform admins.',
      'Browse/filter gear, date-based rentals, and Stripe checkout.',
      'Provider dashboard for inventory CRUD and order status (confirm → picked up → returned).',
      'Customer order tracking, payments, and post-rental reviews; admin moderation with JWT cookie auth.',
      'Role: Solo full-stack — built Next.js frontend and Express/Prisma/PostgreSQL backend; Stripe, Google Sign-In, and role-based dashboards.',
      'API: https://gareup.vercel.app',
    ],
    imageUrls: [
      'https://s0.wp.com/mshots/v1/https%3A%2F%2Fgearupfronted.vercel.app%2F?w=1280',
    ],
    links: {
      github: 'https://github.com/kaziashik/GearUp',
      live: 'https://gearupfronted.vercel.app',
      paper: '',
    },
    featured: true,
    isPublic: true,
    visibility: ['job', 'personal'],
    match: (p) =>
      /gearup/i.test(p.title || '') ||
      p.links?.live?.includes('gearup') ||
      p.links?.github?.includes('GearUp'),
  },
];

async function main() {
  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  if (!loginRes.ok) {
    console.error('Login failed:', loginRes.status, loginBody?.message || loginBody);
    process.exit(1);
  }

  const token = loginBody?.data?.accessToken;
  if (!token) {
    console.error('No accessToken in login response');
    process.exit(1);
  }

  const listRes = await fetch(`${API}/api/projects?visibility=job`);
  const listBody = await listRes.json();
  const existing = listBody?.data || [];

  for (const project of projects) {
    const { match, ...payload } = project;
    const found = existing.find(match);

    if (found?._id) {
      const patchRes = await fetch(`${API}/api/projects/${found._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const patchBody = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) {
        console.error('Update failed:', payload.title, patchRes.status, patchBody?.message || patchBody);
        process.exit(1);
      }
      console.log('Updated:', payload.title, found._id);
      continue;
    }

    const createRes = await fetch(`${API}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const createBody = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      console.error('Create failed:', payload.title, createRes.status, createBody?.message || createBody);
      process.exit(1);
    }
    console.log('Created:', payload.title, createBody?.data?._id || 'ok');
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
