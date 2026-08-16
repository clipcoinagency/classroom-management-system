# ClassConnect

Classroom management platform for FSD (20CS52I) — login, student/teacher dashboards, lab experiment progress tracking, notices & resources, and face-recognition attendance.

**Stack**: Spring Boot + MongoDB (backend), React + Vite (frontend), face-api.js (client-side face recognition, no paid APIs).

## Project structure

```
backend/    Spring Boot API (Java 17, Maven)
frontend/   React app (Vite)
docs/       UI mockups and lab manual reference
```

## Local development

**Backend** — requires a JDK 17+ and a MongoDB connection string:

```bash
cd backend
export MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/classconnect?retryWrites=true&w=majority"
mvn spring-boot:run
```

Runs on `http://localhost:8080`.

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. In development, API calls go to the relative `/api` path, which Vite's dev server proxies to `localhost:8080` (see `vite.config.js`) — no environment variable needed locally.

See [`.env.example`](.env.example) at the repo root for the full list of environment variables and what consumes each one.

## Deployment

The backend and frontend deploy as two separate services. Deploy the backend first — you'll need its live URL to configure the frontend.

### Backend on Render

1. Push this repo to GitHub (if not already).
2. On [Render](https://render.com), **New → Web Service**, connect this GitHub repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Java (Render auto-detects the Maven build; if prompted, build command is `mvn clean package -DskipTests` and start command is `java -jar target/classconnect-backend.jar`)
   - **Health Check Path**: `/health`
4. Add environment variables (Render dashboard → Environment):
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `FRONTEND_URL` — your Vercel URL once you have it (e.g. `https://your-app.vercel.app`) — needed for CORS; you can add this after the frontend is deployed and redeploy the backend
   - `JWT_SECRET` — a long random string (optional but recommended; falls back to a built-in demo value if unset)
   - Do **not** set `PORT` — Render sets this automatically and the app reads it.
5. Deploy. Render will give you a URL like `https://classconnect-backend.onrender.com`.

**Before deploying**, make sure your MongoDB Atlas cluster's Network Access allows connections from `0.0.0.0/0` (or Render's specific egress IPs) — otherwise Render's servers can't reach your database.

**Known limitation**: uploaded resource files are stored on local disk (`backend/uploads/`), which is **ephemeral on Render's free tier** — files are wiped on every redeploy or restart. This is fine for a demo/viva but not for production use; a real deployment would need object storage (e.g. S3-compatible) instead.

### Frontend on Vercel

1. On [Vercel](https://vercel.com), **Add New → Project**, connect this GitHub repo.
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
3. Add environment variable (Project Settings → Environment Variables):
   - `VITE_API_URL` — your Render backend URL from above (e.g. `https://classconnect-backend.onrender.com`), no trailing slash, no `/api` suffix
4. Deploy. Vercel will give you a URL like `https://classconnect.vercel.app`.
5. Go back to Render and set `FRONTEND_URL` to this Vercel URL, then redeploy the backend so CORS allows it.

### Expected URLs after deployment

| Service | Example URL |
|---|---|
| Backend (Render) | `https://classconnect-backend.onrender.com` |
| Backend health check | `https://classconnect-backend.onrender.com/health` → `{"status":"ok"}` |
| Frontend (Vercel) | `https://classconnect.vercel.app` |

Render's free tier spins down after inactivity — the first request after idling can take 30–60 seconds to wake it up.
