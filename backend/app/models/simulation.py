from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class SimulationRecord(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False, default="Unnamed Simulation")
    params = Column(JSON, nullable=False)
    results = Column(JSON, nullable=False)
    iterations = Column(Integer, default=2000)
    duration_ms = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="simulations")
