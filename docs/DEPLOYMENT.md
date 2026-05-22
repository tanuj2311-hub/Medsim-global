# MedSim Global — Deployment Guide

## Frontend → Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
5. Click Deploy

---

## Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `SECRET_KEY` = a long random string
   - `CORS_ORIGINS` = `["https://your-app.vercel.app"]`

---

## Database → Railway or Supabase

### Railway
1. New Project → Add PostgreSQL
2. Copy the `DATABASE_URL` from the connection tab
3. Paste into your Render environment variables
4. Run the schema: `psql $DATABASE_URL -f database/schema.sql`

### Supabase
1. New project → Settings → Database → Connection string
2. Run `database/schema.sql` in the SQL editor

---

## Docker (Self-hosted)

```bash
cd docker
docker-compose up --build -d
```

Services:
- Frontend: http://localhost:3000
- Backend:  http://localhost:8000
- Postgres: localhost:5432

---

## Environment Variables Checklist

| Variable | Where | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend | `https://api.yourdomain.com` |
| `DATABASE_URL` | Backend | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | Backend | 64-char random string |
| `CORS_ORIGINS` | Backend | `["https://yourdomain.com"]` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Backend | `1440` |
