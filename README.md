# URL Shortener

A production-minded URL shortener with:

- **React + Vite** frontend (`url_frontend/`)
- **FastAPI + Postgres** backend (`backend/`)
- Optional **Supabase Auth** (email/password + email confirmation)

## Features

- Shorten URLs with **expiry** and **max click** limits
- Optional **custom short codes**
- **QR code** generation
- Automatic **periodic cleanup** of expired / max-click URLs every 24 hours
- Authenticated dashboard (list/search/sort URLs)

## Tech stack

- **Frontend**: React, TypeScript, Vite, Tailwind
- **Backend**: FastAPI, SQLModel, Postgres
- **Auth**: Supabase (optional but supported)

## Local development

### 1) Environment variables

Copy examples and fill in real values:

- Root: `cp .env.example .env`
- Backend: `cp backend/.env.example backend/.env`
- Frontend: `cp url_frontend/.env.example url_frontend/.env`

### 2) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Backend runs on `http://localhost:8000`.

### 3) Frontend

```bash
cd url_frontend
npm ci
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API response shape

All JSON API endpoints return:

```json
{ "success": true, "data": { } }
```

or

```json
{ "success": false, "error": "Message" }
```

## Deploying to Vercel (frontend)

This repo is structured as a split frontend/backend. The recommended production setup is:

- **Frontend on Vercel**
- **Backend hosted separately** and referenced via `VITE_API_BASE_URL`

Steps:

1. Create a new Vercel project and set the **Root Directory** to `url_frontend/`.
2. Add env var:
   - `VITE_API_BASE_URL=https://<your-backend-domain>`
3. Deploy.

## Linting/formatting (frontend)

```bash
cd url_frontend
npm run lint
npm run format
```

