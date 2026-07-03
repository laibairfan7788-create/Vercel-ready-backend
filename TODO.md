# Portfolio CMS Platform — TODO

## Step 1 — Repo analysis & baseline mapping
- [x] Inspect existing backend structure (server.js, routes, controllers, models)
- [x] Identify mismatches vs required architecture (server imports `./src/...` paths that don’t exist)
- [x] Map current HTML sections (hero/about/services/etc.) to CMS modules to be built

## Step 2 — Backend foundation refactor (to enable CMS)
- [ ] Create production-ready backend structure under `backend/` (app, server, routes, controllers, models, middleware, services, utils)
- [ ] Fix routing mismatch in `server.js` (or replace it with `backend/src/server.js`)
- [ ] Implement complete auth: JWT access + refresh tokens + logout + protected routes
- [ ] Implement role-based access control (Super Admin/Admin/Editor/Viewer)
- [ ] Add forgot/reset/change password flows
- [ ] Add centralized error handling + request validation + security middleware

## Step 3 — CMS data layer (MongoDB schemas + indexes)
- [ ] Implement schemas for:
  - Home/Hero + Stats
  - About
  - Services/Features
  - Characteristics
  - Applications
  - WhyChoose
  - FAQ (already present as model)
  - Gallery
  - Contact
  - Messages
  - Footer
  - Media (cloudinary metadata)
  - SEO
  - Settings
- [ ] Add indexes/uniqueness constraints (slugs, page keys, etc.)

## Step 4 — REST APIs
- [ ] Implement public read endpoints for the portfolio site
- [ ] Implement protected CRUD endpoints for admin/editor
- [ ] Implement analytics endpoints (overview + charts data)
- [ ] Implement Media Library endpoints (upload/search/delete/preview)

## Step 5 — Cloudinary integration
- [ ] Replace local uploads with Cloudinary upload pipeline
- [ ] Add multer->cloudinary upload handling for images/videos/pdfs

## Step 6 — Seed data + Postman
- [ ] Create seed data based on the provided HTML content
- [ ] Generate Postman collection for all APIs
- [ ] Create ERD diagram

## Step 7 — Frontend admin panel (later)
- [ ] Build `frontend-admin/` React app with RTK Query
- [ ] Implement admin dashboard + CRUD UIs for mapped modules

## Step 8 — Portfolio frontend integration (later)
- [ ] Build `frontend-portfolio/` React app consuming the public CMS APIs

## Step 9 — Testing & deployment
- [ ] Add integration tests
- [ ] Add deployment configs (Vercel for frontends, Railway/Render for backend)
- [ ] Add environment variables documentation

