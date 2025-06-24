# Zeta-v2

## Environment configuration

## Comando para evitar problema del firewall: set NODE_TLS_REJECT_UNAUTHORIZED=0

The project uses two environment files inside the `backend` folder:

- `.env` contains public configuration and **is committed** to the repository.
- `.env.secrets` holds sensitive keys like database credentials, the OpenAI API key and the Google Vision credentials path. This file is ignored by Git. Use `.env.secrets.example` as a template. It also stores the Gmail credentials required for the contact form.

The frontend keeps its own public variables in `frontend/.env`.
Add `VITE_IMGBB_KEY` with your imgbb API key to enable image uploads for
community posts.

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
