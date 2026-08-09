/**
 * Add ZapShift via live admin API (no direct DB needed).
 * Usage: node --env-file=.env.production.local scripts/seed-zapshift-api.mjs
 */
const API = process.env.PORTFOLIO_API_URL || 'https://ashikprotfoliobackand.vercel.app';
const email = String(process.env.ADMIN_EMAIL || '').trim().replace(/^['"]|['"]$/g, '');
const password = String(process.env.ADMIN_PASSWORD || '').trim().replace(/^['"]|['"]$/g, '');

if (!email || !password) {
  console.error('ADMIN_EMAIL / ADMIN_PASSWORD missing');
  process.exit(1);
}

const payload = {
  title: 'ZapShift — Door-to-Door Parcel Delivery Platform',
  startDate: '2026-06',
  endDate: 'Present',
  toolsUsed: [
    'React',
    'Vite',
    'Tailwind CSS',
    'DaisyUI',
    'Express.js',
    'MongoDB',
    'Firebase Auth',
    'Stripe',
    'Vercel',
  ],
  details: [
    'Full-stack courier platform for booking, secure payment, rider assignment, and live parcel tracking across Bangladesh.',
    'Role-based dashboards for users, admins, and riders with OTP-confirmed delivery workflow and district coverage maps.',
    'Dynamic pricing by parcel type, weight, and same-city vs inter-district routes, with Stripe checkout and unique PRCL tracking IDs.',
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
};

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
  const existing = (listBody?.data || []).find(
    (p) =>
      /zapshift/i.test(p.title || '') ||
      p.links?.github === payload.links.github ||
      p.links?.live === payload.links.live
  );

  if (existing?._id) {
    const patchRes = await fetch(`${API}/api/projects/${existing._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const patchBody = await patchRes.json().catch(() => ({}));
    if (!patchRes.ok) {
      console.error('Update failed:', patchRes.status, patchBody?.message || patchBody);
      process.exit(1);
    }
    console.log('Updated ZapShift in Featured projects:', existing._id);
    return;
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
    console.error('Create failed:', createRes.status, createBody?.message || createBody);
    process.exit(1);
  }
  console.log('Created ZapShift in Featured projects:', createBody?.data?._id || 'ok');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
