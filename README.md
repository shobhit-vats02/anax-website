# ANAX CODE — Team Portfolio Website (Full-Stack)

The original static/localStorage site is now a real full-stack application:
a static frontend (unchanged UI/UX) talking to a Node.js/Express/MongoDB API.
Any change made in the admin panel is now stored in MongoDB and immediately
visible to every visitor — not just the browser that made it.

## Directory Structure
```
.
├── frontend/                     # Static site — deploy as-is (Render Static Site, Netlify, Vercel, etc.)
│   ├── index.html
│   ├── data/
│   │   └── defaultData.js        # Offline fallback only, used if the API is unreachable
│   └── assets/
│       ├── css/                  # Unchanged from v1
│       └── js/
│           ├── config.js         # NEW — API_BASE_URL
│           ├── api.js            # NEW — fetch wrapper + JWT handling
│           ├── storage.js        # CHANGED — API-backed data cache (was localStorage)
│           ├── app.js            # CHANGED — awaits initData() from the API on boot
│           ├── admin.js          # CHANGED — auth/settings/import/export/reset via API
│           ├── forms.js          # CHANGED — member/achievement/project CRUD via API
│           ├── renderer.js       # Unchanged
│           ├── navigation.js     # Unchanged
│           ├── animations.js     # Unchanged
│           ├── theme.js          # Unchanged
│           ├── binaryRain.js     # Unchanged
│           └── utils.js          # Unchanged
│
└── backend/                      # Node/Express API — deploy as a Render Web Service
    ├── config/db.js              # Mongoose connection
    ├── models/                   # Admin, Member, Achievement, MajorProject, MiniProject, Settings
    ├── controllers/              # Request handlers per resource
    ├── services/                 # Aggregation + backup/reset business logic
    ├── routes/                   # REST endpoints per resource
    ├── middleware/                # JWT auth guard + centralized error handler
    ├── utils/                    # asyncHandler, generateToken
    ├── seed/                     # Default content + one-off seed script
    ├── server.js                 # App entry point
    ├── package.json
    └── .env.example
```

## How data flows now

1. On page load, `storage.js` calls `GET /api/data` once and caches the
   result in memory. Every existing render function (`renderMembers()`,
   `renderAchievements()`, `calcStats()`, etc.) still calls the same
   synchronous `getData()` it always did — only what's behind it changed.
2. Every admin create/update/delete now calls a real REST endpoint
   (`POST/PUT/DELETE /api/...`), then calls `refreshData()` to pull the
   fresh state back into the cache before re-rendering the admin list.
3. Admin login now calls `POST /api/auth/login`, receives a JWT, and stores
   it in `localStorage` under `anaxcode_token`. That token is sent as
   `Authorization: Bearer <token>` on every protected request.

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your MongoDB Atlas URI and a JWT secret
npm run seed     # creates default members/achievements/projects + admin account
npm run dev      # or: npm start
```

The API runs on `http://localhost:5000` by default. Default admin password
after seeding is `anaxcode` (or whatever you set as `ADMIN_DEFAULT_PASSWORD`)
— change it from the admin panel's Settings tab after first login.

### 2. Frontend

`frontend/assets/js/config.js` already points to `http://localhost:5000/api`
when served from `localhost`. Just open `frontend/index.html` in a browser,
or serve the folder with any static server:

```bash
cd frontend
npx serve .
```

## Deployment (Render)

**Backend — Web Service**
1. Push the `backend/` folder to a Git repo (or the whole project, Render
   lets you set a root directory).
2. New → Web Service → connect the repo, root directory `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables from `.env.example` (`MONGODB_URI`,
   `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_DEFAULT_PASSWORD`, `CORS_ORIGIN`,
   `NODE_ENV=production`). Set `CORS_ORIGIN` to your deployed frontend URL.
5. After the first deploy, run `npm run seed` once (Render Shell, or run it
   locally against the same `MONGODB_URI`) to create default content and
   the admin account.

**Frontend — Static Site**
1. New → Static Site → same repo, root directory `frontend`.
2. Build command: (none) · Publish directory: `.`
3. Before deploying, edit `frontend/assets/js/config.js` and replace
   `YOUR-BACKEND-URL.onrender.com` with your actual backend service URL.

**MongoDB Atlas**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from `0.0.0.0/0` (or
   Render's IPs) so the backend can connect.
3. Copy the connection string into `MONGODB_URI`.

## Manual steps required after this handoff

1. Create a MongoDB Atlas cluster and get the connection string.
2. Paste it into `backend/.env` as `MONGODB_URI`.
3. Set a `JWT_SECRET` in `backend/.env`.
4. `npm run seed` once to populate the database.
5. Deploy the backend to Render and the frontend as a static site.
6. Update `API_BASE_URL` in `frontend/assets/js/config.js` to the deployed
   backend URL.

No further coding is required beyond those steps.

## Running the frontend alone (legacy/offline mode)

If the API is unreachable, `storage.js` automatically falls back to the
bundled `data/defaultData.js` so the public pages still render — only the
admin panel requires the backend to be up.
