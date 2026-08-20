from pydantic import BaseModel, ConfigDict
from typing import Optional
from enum import Enum


class WaterType(str, Enum):
    freshwater = "freshwater"
    saltwater = "saltwater"


class InhabitantCreate(BaseModel):
    common_name: str
    family_name: str | None = None
    temp_min: float
    schooling: bool
    amount: int
    tank_level: str | None = None  # e.g. "top", "middle", "bottom"


class Inhabitant(InhabitantCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class TankCreate(BaseModel):
    name: str
    size: str | None = None  # e.g. "60x30x30cm" — free text for now
    liter_capacity: float
    water_type: WaterType
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    planted: bool
    inhabitants: list[InhabitantCreate] = []


class Tank(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    size: str | None = None
    liter_capacity: float
    water_type: WaterType
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    planted: bool
    inhabitants: list[Inhabitant] = []


# Each task is tank specific
class MaintenanceTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tank_id: int
    task_type: str  # e.g. "water change", "filter clean"
    frequency_days: int
    last_done: Optional[str] = None  # ISO date string, e.g. "2026-08-15"
