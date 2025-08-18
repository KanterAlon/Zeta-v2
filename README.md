# Zeta-v2

## Environment configuration

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

## Product search cache

The backend uses [Upstash Redis](https://upstash.com/) to cache results from
the OpenFoodFacts product search API. When a request arrives:

1. The server looks for a `search:<query>` key in Redis.
   - If it exists, the cached products are returned and a log indicates a cache
     hit.
   - If it does not exist, a cache miss is logged.
2. On a cache miss, the OpenFoodFacts API is queried. The response is processed
   and stored in Redis for 24 hours (`SETEX`) so subsequent searches are faster.
3. If `REDIS_URL` is not set or Redis is unavailable, the server skips caching
   and logs that Redis is disabled.

The logs also report when no products are found for a query and when new data is
saved into the cache.
