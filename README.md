# 🧬 MedSim Global
### Monte Carlo-Based Healthcare & Mental Stability Simulation Platform

![MedSim Global](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-teal) ![Python](https://img.shields.io/badge/Python-3.11-yellow)

> A next-generation healthcare crisis simulation platform using probabilistic Monte Carlo modeling to predict hospital overload, mental health deterioration, worker burnout, and systemic cascade failures.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/medsim-global.git
cd medsim-global

# Backend
cd backend
cp .env.example .env          # fill in your values
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — done.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| Charts | Recharts, Chart.js |
| Backend | FastAPI (Python 3.11) |
| Simulation | NumPy, Pandas, SciPy |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose) + bcrypt |
| Deployment | Vercel (frontend) · Render/Railway (backend) |
| Container | Docker + Docker Compose |

---

## 📁 Project Structure

```
medsim-global/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── dashboard/     # Crisis dashboard
│   │   │   ├── mental/        # Mental health dashboard
│   │   │   ├── simulation/    # Simulation lab
│   │   │   ├── whatif/        # What-if analysis
│   │   │   ├── heatmap/       # Geographic heatmap
│   │   │   └── auth/          # Login / Signup
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Base components (GlassCard, MetricCard…)
│   │   │   ├── charts/        # Chart wrappers
│   │   │   └── layout/        # Navigation, sidebar, topbar
│   │   ├── lib/               # Utilities
│   │   │   ├── montecarlo.ts  # Client-side MC engine
│   │   │   ├── api.ts         # API client
│   │   │   └── auth.ts        # Auth helpers
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── main.py            # App entry point
│   │   ├── routers/           # API route handlers
│   │   │   ├── simulation.py  # /api/simulation/*
│   │   │   ├── auth.py        # /api/auth/*
│   │   │   └── reports.py     # /api/reports/*
│   │   ├── simulation/        # Monte Carlo engine
│   │   │   ├── engine.py      # Core MC runner
│   │   │   ├── distributions.py # Gaussian, Poisson, etc.
│   │   │   └── scenarios.py   # Preset crisis scenarios
│   │   ├── models/            # Pydantic + SQLAlchemy models
│   │   ├── core/              # Config, security, DB
│   │   └── database.py        # DB connection
│   └── requirements.txt
│
├── database/
│   └── schema.sql             # PostgreSQL schema
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── docs/
    ├── API.md                 # Full API reference
    └── DEPLOYMENT.md          # Deployment guide
```

---

## 🧠 Monte Carlo Simulation Engine

The platform runs **2,000–10,000 stochastic iterations** per simulation using:

- **Gaussian (Normal) distributions** — infection rate variance, quality score noise
- **Poisson distributions** — new case arrival, mental health admissions
- **Bernoulli random events** — disease mutation, staffing failure, supply shocks

### Chain Reaction Model

```
Disease Outbreak (Poisson arrivals)
  → ICU Demand Spike (Gaussian noise)
    → Doctor Burnout (cumulative pressure)
      → Healthcare Quality Drop
        → Public Anxiety Escalation
          → Mental Health Admissions (feedback)
            → Further ICU Pressure ↩️
```

### Output Metrics

| Metric | Description |
|---|---|
| `mean` | Expected value across all iterations |
| `p10 / p90` | 10th / 90th percentile confidence bounds |
| `P(event)` | Probability of threshold breach |
| `dist[]` | Full histogram distribution |

---

## 🔌 API Endpoints

```
POST /api/simulation/run        Run a Monte Carlo simulation
GET  /api/simulation/scenarios  List preset crisis scenarios
POST /api/auth/register         Create account
POST /api/auth/login            Login, returns JWT
GET  /api/auth/me               Get current user
POST /api/reports/generate      Generate PDF report
```

Full API docs: [docs/API.md](./docs/API.md)

---

## 🐳 Docker

```bash
# Run everything with Docker Compose
docker-compose -f docker/docker-compose.yml up --build
```

Services: `frontend` (3000), `backend` (8000), `postgres` (5432)

---

## 🚢 Deployment

| Service | Platform | Command |
|---|---|---|
| Frontend | Vercel | `vercel --prod` |
| Backend | Render / Railway | Push to main branch |
| Database | Supabase / Railway | Import `database/schema.sql` |

Full guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=MedSim Global
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/medsim
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000
```

---

## 📄 License

MIT — free to use, extend, and deploy.
