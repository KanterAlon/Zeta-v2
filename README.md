# Zeta-v2

## Environment configuration

Authentication is handled by [Clerk](https://clerk.com). The backend must define `CLERK_SECRET_KEY` and the frontend exposes `VITE_CLERK_PUBLISHABLE_KEY`.

## Comando para evitar problema del firewall: set NODE_TLS_REJECT_UNAUTHORIZED=0

The project uses two environment files inside the `backend` folder:

- `.env` contains public configuration (including a `DATABASE_URL` built from
  `SUPABASE_DB_USER` and `SUPABASE_DB_PASSWORD`) and **is committed** to the repository.
- `.env.secrets` holds sensitive keys like database credentials, the OpenAI API key and the Google Vision credentials path. This file is ignored by Git. Use `.env.secrets.example` as a template. It also stores the Gmail credentials required for the contact form.

Copy the example files before running the project:

```bash
cp backend/.env.secrets.example backend/.env.secrets
cp frontend/.env.example frontend/.env
```

The frontend keeps its own public variables in `frontend/.env`. A sample file is provided at `frontend/.env.example`.
For deployment, at minimum set `DATABASE_URL` and `CLERK_SECRET_KEY`.
Add `VITE_IMGBB_KEY` with your imgbb API key to enable image uploads for
community posts. If the key is missing, posts will still be created but
any selected images will be ignored.

## Development

Install dependencies for both the backend and frontend using npm workspaces:

```bash
npm install
```

Then start the application:

```bash
npm run dev
```

This will run the backend server and the Vite frontend concurrently.

Run `npm run lint` to check the frontend code with ESLint.

## Prisma

Use Prisma to interact with the database. The CLI looks for the schema at
`backend/prisma/schema.prisma`, so you can run commands from the repository root
or inside the `backend` folder.

Introspect the existing database with:

```bash
npm run db:pull
```

The script loads `.env.secrets` before `.env` so Prisma receives a connection
string like:

```
postgresql://${SUPABASE_DB_USER}:${SUPABASE_DB_PASSWORD}@${SUPABASE_DB_HOST}:6543/postgres?pgbouncer=true
```

`SUPABASE_DB_HOST` defaults to Supabase's IPv4 connection pool
(`aws-0-us-east-2.pooler.supabase.com`), which avoids IPv6-only hosts that can
cause P1001 errors on machines without IPv6 connectivity. Adjust the host to
match your project's region if needed. Edit `backend/.env.secrets` to provide
your Supabase user and password.

## Product cache

The backend uses [Upstash Redis](https://upstash.com/) to cache both product
search results and individual product details. The cache is smarter now:

1. **Normalized keys:** search terms are normalized (accents, spaces and
   punctuation removed) so variations like `oreo`, `oreoo` or `oreo-` share the
   same cache entry.
2. **Frequency-based storage:** each normalized query increments a counter. Only
   when a query or product is requested repeatedly (default threshold: `3`)
   does the server store the result in Redis (`SETEX`, 24h).
3. **Product details:** requests to the product endpoint also benefit from this
   mechanism, caching the product information itself under `product:<query>`.
4. If `REDIS_URL` is not set or Redis is unavailable, the server skips caching
   and logs that Redis is disabled.

This approach avoids storing rarely used data and prevents duplicate entries for
similar product names.
