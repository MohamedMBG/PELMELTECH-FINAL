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

## Vercel Application

Deploy this repository once as a full-stack Next.js project on Vercel. Vercel
serves the public pages and admin panel and runs the `/api/*` route handlers.
Neon provides the persistent PostgreSQL database.

Required production environment variables:

- `DATABASE_URL`: Neon Postgres connection string.
- `ADMIN_PASSWORD`: strong bootstrap administrator password.
- `ADMIN_SECRET`: long random string for signed session cookies.

## Production Checklist

- Create Neon database.
- Add `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` to Vercel.
- Add the monthly backup variables described below.
- Deploy the complete application to Vercel.
- Test catalog loading, quote submission, admin login, and admin edits.

## Monthly Encrypted Backup

Vercel invokes `/api/cron/monthly-backup` at 03:00 UTC on the first day of
each month. The route exports every application table, encrypts the snapshot
with AES-256-GCM, places it in a ZIP archive, and sends it to the configured
administrator through Resend.

Configure these production environment variables:

- `CRON_SECRET`: random value of at least 16 characters; Vercel sends it to the
  protected cron route.
- `BACKUP_ENCRYPTION_KEY`: a separate random value of at least 32 characters.
  Store a copy in a password manager; an emailed archive cannot be restored
  without it.
- `RESEND_API_KEY`: API key for the Resend account.
- `BACKUP_EMAIL_FROM`: sender on a domain verified by Resend.
- `BACKUP_EMAIL_TO`: administrator who receives the archive.

To decrypt and verify a downloaded archive without changing the live database:

```bash
BACKUP_ENCRYPTION_KEY="the-saved-secret" npm run backup:decrypt -- backup.zip output.json
```

The script refuses to overwrite an existing output file. Test this restore
procedure after the first delivery and periodically afterward. Email backups
are a secondary export; keep Neon recovery enabled and monitor failed cron
invocations in Vercel.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run backup:decrypt -- backup.zip output.json
```
