# Deploying ClassConnect

Step-by-step guide to putting ClassConnect live for real use — backend on [Render](https://render.com), frontend on [Vercel](https://vercel.com). Both have free tiers, no card required.

Deploy the backend first — you need its live URL before configuring the frontend.

> **Never put real passwords or secrets in a file that gets committed to git.** Every credential below goes into Render's or Vercel's dashboard (their Environment Variables settings), never into a file in the repo. `.env.example` at the repo root documents the *shape* of each variable, not real values.

---

## SECTION 1: Deploy Backend on Render

### Prerequisites
- This repo pushed to GitHub (already done).
- A free [Render](https://render.com) account.
- A MongoDB Atlas connection string, with your cluster's **Network Access** set to allow `0.0.0.0/0` (Atlas dashboard → Network Access → Add IP Address → Allow Access from Anywhere). Without this, Render's servers physically cannot reach your database, no matter how correct the connection string is.

### Steps

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your `classroom-management-system` GitHub repo.
4. Configure the service:
   - **Name**: `classconnect-backend`
   - **Root Directory**: `backend` — critical; the `pom.xml` lives in the `backend/` subfolder, not the repo root. If you skip this, the build fails immediately with "no pom.xml found."
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/classconnect-backend.jar`
   - **Health Check Path**: `/health` — Render polls this to decide if your service is alive. Without it set, Render falls back to polling `/`, which requires auth and will look unhealthy even when the app is running fine.
5. Add environment variables (**Environment** tab):

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your real Atlas connection string, e.g. `mongodb+srv://<user>:<password>@<cluster-host>/classconnect?retryWrites=true&w=majority` — paste your actual username and password here directly in Render's dashboard, not in any file |
   | `JWT_SECRET` | A long random string of your choosing. Optional, but the code falls back to a demo value baked into the public source if you skip it — set a real one before sharing the app with your class |
   | `FRONTEND_URL` | Leave this for now — you'll add it after Section 2, once you have your Vercel URL |

   Do **not** set a `PORT` variable — Render assigns one automatically and the app reads it.
6. Click **Deploy**. First build takes roughly 3–5 minutes (Maven downloads dependencies, compiles, packages).
7. Once live, copy the URL Render gives you, e.g. `https://classconnect-backend.onrender.com`. Confirm it's actually working by visiting `https://classconnect-backend.onrender.com/health` in your browser — you should see `{"status":"ok"}`. If you see anything else, check the Troubleshooting section below before moving on.

---

## SECTION 2: Deploy Frontend on Vercel

### Prerequisites
- This repo pushed to GitHub.
- A free [Vercel](https://vercel.com) account.
- Your live Render backend URL from Section 1.

### Steps

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `classroom-management-system` repo.
4. Configure the project:
   - **Root Directory**: `frontend` — same reasoning as the backend; this is a monorepo.
   - **Framework Preset**: Vite (Vercel should auto-detect this once Root Directory is set)
5. Add an environment variable (**Environment Variables** section of the import screen, or Project Settings afterward):

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL from Section 1, e.g. `https://classconnect-backend.onrender.com` — no trailing slash, no `/api` suffix |

6. Click **Deploy**. Takes roughly 1–2 minutes.
7. Once live, copy your URL, e.g. `https://classconnect.vercel.app`.
8. **Go back to Render** and set the `FRONTEND_URL` environment variable you skipped in step 5 of Section 1 to this Vercel URL, then trigger a manual redeploy (Render dashboard → Manual Deploy → Deploy latest commit). Without this step, the backend's CORS policy won't recognize your frontend's origin and every API call from the live site will fail — this is the single most common cause of a deployed app that loads but can't log in.

---

## SECTION 3: Verify Live Deployment

Work through this checklist on your actual deployed URLs (substitute your real Vercel/Render URLs for the examples below):

- [ ] **Login** — go to `https://<your-app>.vercel.app/login`, log in with an existing account (e.g. one you created during local testing). Should redirect to the dashboard.
- [ ] **Sign-up** — go to `/signup`, register a brand-new email. Should show "Account created!" and redirect to login after 2 seconds; log in with the new account to confirm it actually works end-to-end.
- [ ] **Student Dashboard loads real data** — experiment cards with real names, difficulty pills, and progress bars, not blank/loading forever.
- [ ] **Progress update** — click "Update →" on an experiment, set a percentage, save, and confirm the card reflects it immediately.
- [ ] **Notices & Resources** — page loads without error.
- [ ] **Teacher Dashboard** — log in as a teacher account, confirm the student table populates.
- [ ] **Browser console** — open DevTools (F12) → Console tab, reload the page, and work through the checks above again. There should be no red errors — particularly no CORS errors (a striped-through request with "blocked by CORS policy" means `FRONTEND_URL` isn't set correctly on Render, see step 8 above) and no 404s on `/api/...` calls (means `VITE_API_URL` is wrong or missing on Vercel).

If everything above works, your deployment is live and correct.

---

## SECTION 4: Share with Classmates

1. Give classmates the Vercel URL, e.g. `https://classconnect.vercel.app`.
2. They visit it, click **Create an account** on the login screen, and sign up with their own email/password — no invite or approval needed.
3. As the teacher, log in with your teacher account and use the **Class Overview** page to watch real progress come in as classmates use it.

A couple of things worth knowing before this happens:
- **Render's free tier spins down after ~15 minutes of inactivity.** The first request after idling can take 30–60 seconds to wake it back up — the login screen will just look slow/stuck, not broken. Warn classmates about this if you're demoing live, or hit the `/health` URL yourself a minute beforehand to warm it up.
- **Uploaded resource files don't persist across backend redeploys** on Render's free tier (local disk storage, ephemeral by design) — fine for a demo, but don't rely on it for anything you need to keep long-term.

---

## Troubleshooting

**"Backend times out" / requests hang or fail**
- Most common cause: **cold start**. Render's free tier sleeps after inactivity; the first request can take 30–60s. Wait and retry before assuming something's broken.
- Check Render's **Logs** tab for the service. Look for `Started ClassConnectApplication` — if you don't see it, the app never came up; scroll up for the actual error.
- If the log shows a MongoDB connection error (`MongoSocketOpenException`, `MongoTimeoutException`): either `MONGODB_URI` isn't set correctly in Render's Environment tab, or your Atlas cluster's Network Access doesn't allow Render's IPs — see Section 1 prerequisites.
- If the log shows Maven failing immediately with something like "no POM in this directory" or "cannot find pom.xml": confirm **Root Directory** is set to `backend`, not the repo root.

**"Frontend shows blank" (white screen)**
- Open the browser console — a blank page with a JS error usually means the build itself is fine but something crashed at runtime. Check for a stack trace.
- Confirm **Root Directory** is set to `frontend` in Vercel's project settings.
- Confirm the Vercel deployment actually succeeded (Vercel dashboard → Deployments — look for a green checkmark, not a red X).
- If it's blank specifically on first load with no console error, try a hard refresh (Ctrl+Shift+R) — stale cached assets from a previous deploy can cause this.

**"API calls fail" (login/dashboard never load data, network errors in console)**
- Open DevTools → Network tab, reload, and click a failed `/api/...` request:
  - **Status shows as "CORS error" / "blocked by CORS policy"**: `FRONTEND_URL` isn't set on Render, or doesn't exactly match your Vercel URL (including `https://`, no trailing slash). Set it and redeploy the backend.
  - **404 Not Found**, or the request goes to the wrong host entirely: `VITE_API_URL` is missing or wrong on Vercel. Check Project Settings → Environment Variables, fix it, and **redeploy** — Vite bakes this value in at build time, so just changing the dashboard value doesn't retroactively fix an already-built deployment.
  - **401/403 Unauthorized**: expected for protected endpoints if you're not logged in; only a problem if it happens *after* logging in successfully, which would suggest the JWT isn't being sent or accepted — check that `localStorage` actually has a `classconnect_token` value after login.

**Still stuck**
- Render Logs and your browser's DevTools console are the two most useful sources of truth — the actual error message almost always points directly at one of the causes above.
