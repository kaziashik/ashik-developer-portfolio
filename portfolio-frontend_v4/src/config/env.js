/**
 * API base URL is set per environment:
 * - npm run dev      → .env.development  → http://localhost:5000
 * - npm run build    → .env.production   → Vercel deployment URL
 * - npm run preview  → production build (Vercel URL baked in at build time)
 *
 * Shared secrets (Firebase, Cloudinary) stay in your local `.env` file.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const APP_MODE = import.meta.env.MODE
export const IS_DEV = import.meta.env.DEV
export const IS_PROD = import.meta.env.PROD

if (IS_DEV) {
  console.info(`[portfolio] ${APP_MODE} mode → API ${API_BASE_URL}`)
}
