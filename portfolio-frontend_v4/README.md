# Portfolio Frontend (Job / Developer Site)

**Live website:** [https://ashikportfolio-auth.web.app](https://ashikportfolio-auth.web.app)

React + Vite, Tailwind v4 + DaisyUI, Framer Motion — same visual design as before, now wired to your live backend instead of static data.

## 1. First — apply the backend additions

See **`BACKEND_ADDITIONS_REQUIRED.md`** in this folder. Two small edits to your existing backend's `project` module (an `isPublic` field + one new admin route) are required before "Add Project" and the visitor-visibility toggle will fully work. Everything else in this frontend works against your backend as-is.

## 2. Setup

```bash
npm i
cp .env.example .env
```

Fill in `.env`:
- `VITE_API_BASE_URL` — defaults to `http://localhost:5000`, change when you deploy the backend
- `VITE_FIREBASE_*` — from Firebase Console → Project Settings → Your apps → SDK config
- `VITE_CLOUDINARY_*` — from Cloudinary Console → Upload presets (add an **unsigned** preset), powers the "Update Image" profile photo feature

Contact form needs no frontend env vars — it posts directly to your backend's `/api/contact`, which handles the email sending itself.

**One Firebase Console setup step, done once:** go to Authentication → Users → Add User, and create a user with the *exact same email* as your backend's `ADMIN_EMAIL`. This is what "Login with Email/Password" and "Login with Google" both authenticate against — Firebase is the login UI, but the bridge to your backend only trusts a token whose email matches your one true admin.

```bash
npm run dev
```

## 3. What's live vs. what's still static

| Section | Data source |
|---|---|
| Hero (name, photo, tagline, socials, latest role tag) | `GET /api/profile` + `GET /api/experiences` |
| About Me | `profile.researchSummary` (reused as the About text — editable via the Update button) |
| Skills & Tech Stack | `profile.developmentSkills` |
| Featured Projects | `GET /api/projects?visibility=job` |
| Experience / Education | `GET /api/experiences` / `GET /api/education` (read-only for now — same CRUD pattern as Projects can be added on request) |
| Contact form | `POST /api/contact` on your backend (Nodemailer) — confirmed working via your Postman test |
| Contributions | Still static (`src/utils/data.js`) — not part of your backend schema |

## 4. Admin flow

1. Click your name in the navbar (or go to `/login`) → sign in with email/password or Google
2. Every section that supports management now shows extra controls only to you:
   - **Hero** → hover the photo → Update Image (uploads to Cloudinary, saves URL to profile)
   - **About** → Update button → edit text → Submit
   - **Skills & Tech Stack** → Update button → add/edit/remove categories inline
   - **Projects** → "+ Add New Project" card, plus Update / Show-Hide / Delete on every card
3. Every action shows a SweetAlert2 success/error message
4. Click the "Admin" badge in the navbar → Log out

## 5. Deploying

Hosted on Firebase: **https://ashikportfolio-auth.web.app**

```bash
npm run build
firebase deploy --only hosting --project ashikportfolio-auth
```

Make sure production env values (especially `VITE_API_BASE_URL` pointing at your deployed backend) are set before building — Vite bakes `VITE_*` vars into the build at build time, not runtime.
