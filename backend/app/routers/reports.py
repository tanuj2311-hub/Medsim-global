from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import io
import json
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.simulation import SimulationRecord
from app.core.security import get_current_user

router = APIRouter()


class ReportRequest(BaseModel):
    simulation_id: Optional[int] = None
    params: Optional[dict] = None
    result: Optional[dict] = None


def build_pdf_text(name: str, params: dict, result: dict) -> str:
    lines = [
        f"MEDSIM GLOBAL — Simulation Report",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}",
        f"Scenario: {name}",
        "",
        "=== SIMULATION PARAMETERS ===",
        f"Infection Rate:          {params.get('infection_rate', 0):.2f}",
        f"ICU Beds:                {params.get('icu_beds', 0)}",
        f"Doctors Available:       {params.get('doctors_available', 0)}",
        f"Medicine Stock:          {params.get('medicine_stock', 0):.2f}",
        f"Isolation Factor:        {params.get('isolation_factor', 0):.2f}",
        f"Public Panic Level:      {params.get('public_panic_level', 0):.2f}",
        "",
        "=== MONTE CARLO RESULTS ===",
        f"Iterations Run:          {result.get('n', 0):,}",
        f"Mean ICU Occupancy:      {result.get('means', {}).get('icuOcc', 0)*100:.1f}%",
        f"Mean Burnout Risk:       {result.get('means', {}).get('burnout', 0)*100:.1f}%",
        f"Mean Anxiety Level:      {result.get('means', {}).get('anxiety', 0)*100:.1f}%",
        f"Mean Collapse Prob.:     {result.get('means', {}).get('collapse', 0)*100:.1f}%",
        f"Mental Stability:        {result.get('means', {}).get('mental', 0)*100:.1f}%",
        f"Healthcare Quality:      {result.get('means', {}).get('quality', 0)*100:.1f}%",
        "",
        "=== EVENT PROBABILITIES ===",
        f"P(ICU Overload):         {result.get('probs', {}).get('icuOverload', 0)*100:.1f}%",
        f"P(Severe Burnout):       {result.get('probs', {}).get('severeBurnout', 0)*100:.1f}%",
        f"P(Mental Crisis):        {result.get('probs', {}).get('mentalCrisis', 0)*100:.1f}%",
        f"P(System Collapse):      {result.get('probs', {}).get('collapse', 0)*100:.1f}%",
        f"P(Mutation Event):       {result.get('probs', {}).get('mutation', 0)*100:.1f}%",
        "",
        "=== 90th PERCENTILE BOUNDS ===",
        f"ICU Occupancy p90:       {result.get('p90', {}).get('icuOcc', 0)*100:.1f}%",
        f"Burnout Risk p90:        {result.get('p90', {}).get('burnout', 0)*100:.1f}%",
        f"Collapse Prob. p90:      {result.get('p90', {}).get('collapse', 0)*100:.1f}%",
        "",
        "--- MedSim Global v1.0.0 ---",
    ]
    return "\n".join(lines)


from typing import Optional


@router.post("/generate")
def generate_report(
    req: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if req.simulation_id:
        record = db.query(SimulationRecord).filter(
            SimulationRecord.id == req.simulation_id,
            SimulationRecord.user_id == current_user.id,
        ).first()
        if not record:
            raise HTTPException(status_code=404, detail="Simulation not found")
        name, params, result = record.name, record.params, record.result
    elif req.params and req.result:
        name, params, result = "Custom Simulation", req.params, req.result
    else:
        raise HTTPException(status_code=400, detail="Provide simulation_id or params+result")

    content = build_pdf_text(name, params, result)
    buffer = io.BytesIO(content.encode("utf-8"))
    filename = f"medsim-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"
    return StreamingResponse(
        buffer,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
