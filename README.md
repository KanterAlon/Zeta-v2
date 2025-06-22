# Zeta-v2

## Environment configuration

The project uses two environment files inside the `backend` folder:

- `.env` contains public configuration and **is committed** to the repository.
- `.env.secrets` holds sensitive keys like database credentials, the OpenAI API key and the Google Vision credentials path. This file is ignored by Git. Use `.env.secrets.example` as a template.

The frontend keeps its own public variables in `frontend/.env`.
