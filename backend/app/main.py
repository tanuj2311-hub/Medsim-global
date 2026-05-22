from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database import engine, Base
from app.routers import auth, simulation, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MedSim Global API",
    description="Monte Carlo Healthcare Simulation Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["simulation"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])


@app.get("/")
def root():
    return {"status": "ok", "service": "MedSim Global API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
