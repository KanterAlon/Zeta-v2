# Zeta-v2

## Environment configuration

## Comando para evitar problema del firewall: set NODE_TLS_REJECT_UNAUTHORIZED=0

The project uses two environment files inside the `backend` folder:

- `.env` contains public configuration and **is committed** to the repository.
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
npx prisma db pull
```

Ensure that `backend/.env.secrets` defines `DATABASE_URL` so Prisma can
connect correctly.
