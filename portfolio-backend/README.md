# Portfolio Backend

Unified MongoDB Atlas backend for three frontends — Job Portfolio, Academic/PhD Portfolio, Personal Website — fully CRUD-manageable through JWT-protected admin routes.

Plain JavaScript, ES Modules, Express, Mongoose. No TypeScript, no Prisma.

---

## 1. Setup

```bash
npm i
cp .env.example .env
```

Open `.env` and fill in:
- `DATABASE_URL` — your MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login you'll use to manage your data

Then create your one admin account (there is no public registration route on purpose):
```bash
npm run seed:admin
```

Start the dev server:
```bash
npm run dev
```

You should see:
```
MongoDB Atlas connected
Portfolio backend listening on port 5000 [development]
```

Visit `http://localhost:5000/health` — should return `{ "success": true, "message": "OK", ... }`.

---

## 2. Testing in Postman

1. **Login** — `POST http://localhost:5000/api/auth/login`
   ```json
   { "email": "your_admin_email", "password": "your_admin_password" }
   ```
   Copy the `accessToken` from the response. A `refreshToken` cookie is also set automatically (Postman keeps cookies per-domain if you enable its cookie jar).

2. **Authenticated requests** — for every `POST` / `PATCH` / `PUT` / `DELETE`, add header:
   ```
   Authorization: Bearer <accessToken>
   ```

3. **Public requests** — every `GET` route works with no header at all.

4. **Refresh** — `POST /api/auth/refresh-token` (sends the cookie automatically) → returns a new `accessToken` once the old one expires.

5. Try a bad request on purpose — e.g. `POST /api/experiences` with an empty body — you should get a clean `400` with a `errors` object, never a raw stack trace or a crashed server.

---

## 3. Full API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/auth/login` | none | `{ email, password }` |
| POST | `/auth/refresh-token` | refresh cookie | — |
| POST | `/auth/logout` | none | — |
| GET | `/auth/me` | admin | — |

### Admin
| Method | Path | Auth |
|---|---|---|
| GET | `/admin/me` | admin |
| PATCH | `/admin/change-password` | admin — body `{ currentPassword, newPassword }` |

### Profile (singleton)
| Method | Path | Auth |
|---|---|---|
| GET | `/profile` | none |
| PUT | `/profile` | admin |

### Profile skills (`:type` = `research` or `development`)
| Method | Path | Auth |
|---|---|---|
| PATCH | `/profile/skills/:type` | admin — body `{ category, items, order }` |
| PATCH | `/profile/skills/:type/:skillId` | admin — body any of `{ category, items, order }` |
| DELETE | `/profile/skills/:type/:skillId` | admin |
| PATCH | `/profile/skills/:type/reorder` | admin — body `[{ skillId, order }, ...]` |

### Every other collection (`experiences`, `education`, `projects`, `publications`, `awards`, `certifications`, `memberships`, `leadership`, `volunteer`, `posts`)
Same 5-route CRUD shape for each:
| Method | Path | Auth |
|---|---|---|
| GET | `/<collection>` | none — supports filters below |
| GET | `/<collection>/:id` | none |
| POST | `/<collection>` | admin |
| PATCH | `/<collection>/:id` | admin |
| DELETE | `/<collection>/:id` | admin |

**Query filters supported per collection:**
- `experiences` → `?visibility=job` `?category=Research`
- `education` → `?visibility=academic`
- `projects` → `?visibility=job` `?featured=true`
- `publications` → `?visibility=academic` `?type=Journal` `?status=Published`
- `awards`, `certifications`, `memberships`, `leadership`, `volunteer` → `?visibility=`
- `posts` → `?visibility=personal` `?category=hobby`

### References
Same CRUD shape as above, but **every route requires admin auth**, including `GET` — contact info for your referees isn't served publicly.
```
GET/POST/PATCH/DELETE  /references[...]   → admin only
```

---

## 4. Adding a 13th Collection Later

Add an entry to `scripts/generateModules.mjs` (`MODULES` array), then run:
```bash
node scripts/generateModules.mjs
```
This writes `model.js` / `service.js` / `controller.js` / `routes.js` for the new module. Then:
1. Import + mount it in `src/routes/index.js`
2. Done — no other file needs touching

---

## 5. Project Structure

```
portfolio-backend/
├── src/
│   ├── config/          # env config + mongoose connection
│   ├── modules/          # one folder per collection: model → service → controller → routes
│   ├── middleware/       # auth, global error handler, 404 handler
│   ├── utils/            # AppError, catchAsync, jwtUtils, sendResponse
│   ├── routes/index.js   # mounts every module under /api
│   ├── app.js            # express app + middleware wiring
│   └── server.js         # entry point for local dev
├── api/index.js          # Vercel serverless entry point (reuses src/app.js)
├── scripts/
│   ├── seedAdmin.js       # creates your one admin account
│   └── generateModules.mjs # scaffolds new modules
├── vercel.json
├── .env.example
└── package.json
```

---

## 6. Deploying to Vercel

1. Push this project to a GitHub repo
2. Import it in Vercel
3. Add all the same environment variables from `.env` into the Vercel project's Environment Variables settings (Production + Preview)
4. Deploy — Vercel picks up `vercel.json` and routes every request through `api/index.js`, which reuses the exact same Express app you tested locally
5. In MongoDB Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`), since Vercel's serverless functions don't have a fixed IP

---

## 7. Why It Won't Crash on Bad Input

- Every controller is wrapped in `catchAsync` — no unhandled promise rejection ever reaches the process
- `globalErrorHandler` recognizes Mongoose `ValidationError`, `CastError` (bad ObjectId), duplicate-key errors, malformed JSON bodies, and expired/invalid JWTs — each gets a clean `4xx` response instead of a `500` or a stack trace
- `notFound` middleware catches any route that doesn't exist → `404`, not a hang
- `server.js` has `unhandledRejection` / `uncaughtException` handlers as a last-resort safety net, logging and shutting down gracefully instead of crashing silently
- `Profile` auto-creates itself on first `GET` if it doesn't exist yet, so the singleton can never 404
