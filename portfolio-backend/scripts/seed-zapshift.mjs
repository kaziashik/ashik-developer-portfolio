/**
 * One-off seed: add ZapShift to Featured / Selected Work.
 * Usage: node --env-file=.env.production.local scripts/seed-zapshift.mjs
 */
import mongoose from 'mongoose';

const DATABASE_URL = String(process.env.DATABASE_URL || '')
  .trim()
  .replace(/^['"]|['"]$/g, '');
if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}
if (!/^mongodb(\+srv)?:\/\//i.test(DATABASE_URL)) {
  console.error('DATABASE_URL does not look like a Mongo connection string (check quotes/encoding in Vercel env)');
  process.exit(1);
}

const projectSchema = new mongoose.Schema(
  {
    title: String,
    startDate: String,
    endDate: String,
    toolsUsed: [String],
    details: [String],
    imageUrls: [String],
    links: { github: String, live: String, paper: String },
    featured: Boolean,
    isPublic: Boolean,
    visibility: [String],
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

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
  await mongoose.connect(DATABASE_URL);
  const existing = await Project.findOne({
    $or: [
      { 'links.github': payload.links.github },
      { 'links.live': payload.links.live },
      { title: /ZapShift/i },
    ],
  });

  if (existing) {
    existing.set({ ...payload });
    await existing.save();
    console.log('Updated existing ZapShift project:', existing._id.toString());
  } else {
    const created = await Project.create(payload);
    console.log('Created ZapShift project:', created._id.toString());
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err.message || err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
