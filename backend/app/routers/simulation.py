from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.models.simulation import SimulationRecord
from app.simulation.engine import run_monte_carlo, generate_timeline
from app.simulation.scenarios import SCENARIOS
from app.core.security import get_current_user

router = APIRouter()


class SimParams(BaseModel):
    infection_rate: float = Field(0.35, ge=0, le=1)
    icu_beds: int = Field(500, ge=50, le=1200)
    doctors_available: int = Field(200, ge=20, le=600)
    nurses_available: int = Field(600, ge=60, le=1800)
    medicine_stock: float = Field(0.75, ge=0, le=1)
    sleep_quality: float = Field(0.6, ge=0, le=1)
    isolation_factor: float = Field(0.35, ge=0, le=1)
    workload: float = Field(0.45, ge=0, le=1)
    economic_pressure: float = Field(0.4, ge=0, le=1)
    disease_mutation_chance: float = Field(0.05, ge=0, le=0.4)
    staffing_failure_risk: float = Field(0.08, ge=0, le=0.8)
    supply_chain_risk: float = Field(0.1, ge=0, le=0.8)
    public_panic_level: float = Field(0.3, ge=0, le=1)


class RunRequest(BaseModel):
    params: SimParams
    iterations: int = Field(2000, ge=100, le=10000)


class SaveRequest(BaseModel):
    name: str
    params: SimParams
    result: dict


@router.post("/run")
def run_simulation(req: RunRequest):
    params_dict = req.params.model_dump()
    result = run_monte_carlo(params_dict, req.iterations)
    return result


@router.get("/timeline")
def get_timeline(
    infection_rate: float = 0.35,
    icu_beds: int = 500,
    doctors_available: int = 200,
    medicine_stock: float = 0.75,
    public_panic_level: float = 0.3,
):
    params = {
        "infection_rate": infection_rate, "icu_beds": icu_beds,
        "doctors_available": doctors_available, "nurses_available": 600,
        "medicine_stock": medicine_stock, "sleep_quality": 0.6,
        "isolation_factor": 0.35, "workload": 0.45, "economic_pressure": 0.4,
        "disease_mutation_chance": 0.05, "staffing_failure_risk": 0.08,
        "supply_chain_risk": 0.1, "public_panic_level": public_panic_level,
    }
    return generate_timeline(params)


@router.get("/scenarios")
def get_scenarios():
    return SCENARIOS


@router.post("/save")
def save_simulation(
    req: SaveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = SimulationRecord(
        user_id=current_user.id,
        name=req.name,
        params=req.params.model_dump(),
        result=req.result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "name": record.name, "created_at": record.created_at}


@router.get("/list")
def list_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = db.query(SimulationRecord).filter(SimulationRecord.user_id == current_user.id).order_by(SimulationRecord.created_at.desc()).limit(20).all()
    return [{"id": r.id, "name": r.name, "created_at": r.created_at} for r in records]


@router.delete("/delete/{sim_id}")
def delete_simulation(
    sim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(SimulationRecord).filter(SimulationRecord.id == sim_id, SimulationRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Simulation not found")
    db.delete(record)
    db.commit()
    return {"deleted": True}
