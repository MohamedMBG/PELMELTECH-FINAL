# PelmelTech

Next.js (App Router) site with API routes for the catalog, admin panel, quotes,
and auth. Data is stored in PostgreSQL via the `postgres` driver.

## Environment variables

Copy the template and fill it in for local work — never commit real secrets:

```bash
cp .env.example .env.local
```

| Variable | Required in production | Purpose |
|---|---|---|
| `NODE_ENV` | yes (`production`) | Enables fail-secure behavior (see below). |
| `ADMIN_PASSWORD` | **yes** | Bootstrap superadmin login password. |
| `ADMIN_SECRET` | **yes** | HMAC key for signed session cookies (>= 16 chars). |
| `DATABASE_URL` | **yes** | Postgres connection string. |
| `CRON_SECRET` | for backups | Bearer token guarding `/api/cron/monthly-backup` (>= 16 chars). |
| `BACKUP_ENCRYPTION_KEY` | for backups | AES-256-GCM passphrase for backup archives (>= 32 chars). |
| `RESEND_API_KEY` | for backups | Resend API key used to email the backup. |
| `BACKUP_EMAIL_FROM` | for backups | Resend-verified sender. |
| `BACKUP_EMAIL_TO` | for backups | Backup recipient. |

In production, secrets come from the process environment (e.g. a systemd
`EnvironmentFile` such as `/etc/pelmeltech/pelmeltech.env`) — **not** from a
committed file. All scripts read from `process.env`, so they work whether the
variables come from systemd, the shell, or an optional `--env-file`.

## Production fail-secure behavior

When `NODE_ENV=production`:

- `ADMIN_PASSWORD`, `ADMIN_SECRET`, and `DATABASE_URL` are **required**. Missing
  ones raise a clear error that names the variable but never prints its value.
- Known placeholder values (e.g. `admin`, `dev-insecure-secret-change-me`) are
  **rejected**.
- The app **never** falls back to the `data/store.json` file store; Postgres is
  mandatory. (The file store is used only in development, and only during
  `next build` static generation.)

Validate a target environment without connecting anywhere:

```bash
npm run config:check          # validates a production target; exit 1 if invalid
npm run config:check --dev    # validate the current (dev) environment instead
```

## Local development

At minimum set `ADMIN_PASSWORD` and `ADMIN_SECRET` in `.env.local`.
`DATABASE_URL` is optional locally — without it the app uses `data/store.json`
(git-ignored). Then:

```bash
npm run dev     # http://localhost:3000
```

## Database

Schema = five `jsonb` tables: `pelmel_products`, `pelmel_categories`,
`pelmel_quotes`, `pelmel_devis`, `pelmel_users`. The DDL lives in one place
(`src/lib/schema.ts`) and is shared by the app and the init script.

Create the tables explicitly (idempotent, never deletes, never seeds):

```bash
npm run db:init
# or, reading an env file:
node --import tsx --env-file=.env.local scripts/db-init.ts
```

### Seeding

Safe initial seed — upsert only, preserves admin-created rows, safe to re-run:

```bash
npm run seed:initial
```

Destructive synchronization — **DELETES** products/categories that are not in
`src/data/*.json`. Guarded so it cannot run by accident: it requires the
`--prune` flag **and** `CONFIRM_DESTRUCTIVE_SEED=yes`, refuses when
`NODE_ENV=production`, and prints the ids it will delete first.

```bash
CONFIRM_DESTRUCTIVE_SEED=yes npm run seed:sync:destructive
```

Do not run the destructive command against a database that holds admin-authored
catalog entries — they will be removed.

## Health check

`GET /api/health` reports readiness without exposing secrets:

- `config`: `ok` / `invalid` (with the names of any misconfigured variables).
- `db`: `{ configured, reachable, schemaReady }` — distinguishes "no DB
  configured" from "configured but unreachable".
- HTTP `200` when healthy, `503` when config is invalid or the DB is
  unreachable.

## Backups

`/api/cron/monthly-backup` exports the five tables, encrypts the snapshot with
AES-256-GCM, zips it, and emails it via Resend. Authenticated with
`Authorization: Bearer $CRON_SECRET`. On a VPS, trigger it from cron/systemd
instead of a platform scheduler.

Decrypt/verify a downloaded archive (does not touch the live database):

```bash
BACKUP_ENCRYPTION_KEY="the-saved-key" npm run backup:decrypt -- backup.zip output.json
```

## Production provisioning (run on the VPS — not part of this local task)

In production the variables live in a systemd `EnvironmentFile`, e.g.
`/etc/pelmeltech/pelmeltech.env`. An `npm run <script>` does **not** read that
file automatically, so pass it to Node explicitly with `--env-file`:

```bash
node --env-file=/etc/pelmeltech/pelmeltech.env --import tsx scripts/config-check.ts
node --env-file=/etc/pelmeltech/pelmeltech.env --import tsx scripts/db-init.ts
node --env-file=/etc/pelmeltech/pelmeltech.env --import tsx scripts/seed.ts   # safe upsert
```

The systemd unit itself loads the same file with `EnvironmentFile=`.

**File syntax** — keep it to plain `KEY=value`, one per line, so it parses
identically for Node's `--env-file` and for systemd's `EnvironmentFile`:

- no `export` prefix
- no shell interpolation (`$OTHER`), no command substitution
- prefer unquoted values; avoid wrapping in quotes (the two parsers treat
  quotes differently)
- `#` comment lines are fine

Recommended production command order (see also the deployment plan):

```
1. npm ci            # deps from lockfile
2. config:check      # validate env before any DB mutation
3. npm run build     # fail fast on code errors BEFORE touching the DB
4. db:init           # create the five tables
5. seed:initial      # load initial catalog (once)
6. start the service
```

Build precedes `db:init`/`seed` so a failed build never leaves a
partially-prepared database. The build needs no database (all data is fetched
at request time from the dynamic `/api` routes), and in production it is
fail-closed: a missing `DATABASE_URL` errors instead of using the file store.

## Local validation commands

```bash
npm ci
npm run lint
npm run test          # unit tests; DB integration tests skip unless TEST_DATABASE_URL is set
npm run build
npm run config:check
```

Integration tests require a **disposable** local database only:

```bash
TEST_DATABASE_URL=postgresql://localhost:5432/pelmel_test npm test
```

> **Build note:** `src/app/layout.tsx` uses `next/font/google` (Manrope, Cairo).
> `next build` fetches these fonts from Google Fonts, so the build has a
> network dependency and can fail transiently offline. The font files are not
> vendored in the repo; self-hosting would require adding them. Until then this
> remains a known build-time network dependency.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run config:check
npm run db:init
npm run seed:initial
npm run seed:sync:destructive   # dangerous; guarded
npm run backup:decrypt -- backup.zip output.json
```
