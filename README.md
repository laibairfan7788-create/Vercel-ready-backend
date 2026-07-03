# MERN Backend — Vercel Deployment

This is an Express + MongoDB (Mongoose) API, already structured to run as a
Vercel serverless function: `server.js` exports the Express `app` instead of
calling `app.listen()` in production, and `config/db.js` caches the MongoDB
connection across invocations.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` is already gitignored — never commit it.

## 2. Set up MongoDB Atlas

- Create a free cluster at mongodb.com/atlas if you don't have one.
- Under **Network Access**, allow `0.0.0.0/0`. Vercel functions don't have a
  static outbound IP on the standard plan, so IP allow-listing won't work.
- Copy your connection string (Database → Connect → Drivers).

## 3. Deploy on Vercel

1. Go to vercel.com → **Add New → Project** → import this repo.
2. Vercel will detect `vercel.json` and use `@vercel/node` to build `server.js`.
3. Under **Project Settings → Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (`openssl rand -hex 32`) |
   | `CORS_ORIGIN` | your deployed frontend URL, e.g. `https://your-frontend.vercel.app` (comma-separate multiple origins) |
   | `NODE_ENV` | `production` |

4. Click **Deploy**.
5. Once live, verify at `https://<your-backend>.vercel.app/health`.

## 4. Connect your frontend

Point your frontend's API base URL env variable (e.g. `REACT_APP_API_URL` or
`VITE_API_URL`) at `https://<your-backend>.vercel.app/api`, and make sure
`CORS_ORIGIN` on the backend matches the frontend's deployed URL exactly
(no trailing slash).

## Known limitation: gallery image uploads

`middleware/upload.js` uses `multer` disk storage. Vercel's filesystem is
read-only at runtime except `/tmp`, and `/tmp` is wiped between invocations —
it is not persistent storage. This code now writes to `/tmp` on Vercel so the
upload request won't crash, but **uploaded files will not survive** past that
single request/deployment.

For real production use, replace the disk storage in `middleware/upload.js`
with a direct upload to an external store such as Cloudinary, S3, or Vercel
Blob, and save the resulting URL to `Gallery.image` instead of a local path.

## Troubleshooting

See Section 11 of the accompanying deployment guide PDF for common issues:
500 errors (usually a missing `MONGODB_URI`), "Cannot find module" during
build, Atlas connection refused, CORS errors, and env var changes not taking
effect until you redeploy.
