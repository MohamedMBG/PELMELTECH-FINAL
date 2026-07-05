# PelmelTech

Next.js frontend with API routes for the catalog, admin panel, quotes, and auth.

## Local Development

Create a local env file:

```bash
cp .env.example .env.local
```

At minimum, set `ADMIN_PASSWORD` and `ADMIN_SECRET`. `DATABASE_URL` is optional locally; without it the app writes to `data/store.json`, which is ignored by Git.

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Neon Database

Create a Neon Postgres database and copy its connection string into `DATABASE_URL`.

On first API access, the app creates these tables automatically and seeds products/categories from `src/data` if the database is empty:

- `pelmel_products`
- `pelmel_categories`
- `pelmel_quotes`

Quotes are not seeded in production.

## Render Backend

Deploy this repository as a Render Web Service. Render can read `render.yaml`.

Required environment variables on Render:

- `DATABASE_URL`: Neon Postgres connection string.
- `ADMIN_PASSWORD`: strong admin password.
- `ADMIN_SECRET`: long random string for signed session cookies.

Build command:

```bash
npm ci && npm run build
```

Start command:

```bash
npm run start -- -p $PORT
```

Health check path:

```text
/api/health
```

## Vercel Frontend

Deploy the same repository to Vercel as a Next.js project.

Set this Vercel environment variable after the Render backend URL exists:

```text
BACKEND_URL=https://your-render-service.onrender.com
```

When `BACKEND_URL` is set, Next proxies frontend calls from `/api/*` to the Render backend. This keeps the browser using same-origin `/api` URLs while the real backend runs on Render.

Use the same `ADMIN_PASSWORD` and `ADMIN_SECRET` on Vercel and Render so the admin cookie can be verified consistently through the proxy.

## Production Checklist

- Create Neon database.
- Add `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` to Render.
- Deploy Render backend and confirm `/api/health` returns `{ "ok": true }`.
- Add `BACKEND_URL` to Vercel using the Render URL.
- Add the same `ADMIN_PASSWORD` and `ADMIN_SECRET` to Vercel.
- Deploy Vercel frontend.
- Test catalog loading, quote submission, admin login, and admin edits.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
