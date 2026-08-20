from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class TankORM(Base):
    __tablename__ = "tanks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    size = Column(String, nullable=True)
    liter_capacity = Column(Float, nullable=False)
    water_type = Column(String, nullable=False)
    temp_min = Column(Float, nullable=True)
    temp_max = Column(Float, nullable=True)
    planted = Column(Boolean, nullable=False)

    inhabitants = relationship("InhabitantORM", back_populates="tank", cascade="all, delete-orphan")
    maintenance_tasks = relationship("MaintenanceTaskORM", back_populates="tank", cascade="all, delete-orphan")


class InhabitantORM(Base):
    __tablename__ = "inhabitants"

    id = Column(Integer, primary_key=True, index=True)
    tank_id = Column(Integer, ForeignKey("tanks.id"), nullable=False)
    common_name = Column(String, nullable=False)
    family_name = Column(String, nullable=True)
    temp_min = Column(Float, nullable=False)
    schooling = Column(Boolean, nullable=False)
    amount = Column(Integer, nullable=False)
    tank_level = Column(String, nullable=True)

    tank = relationship("TankORM", back_populates="inhabitants")


class MaintenanceTaskORM(Base):
    __tablename__ = "maintenance_tasks"

    id = Column(Integer, primary_key=True, index=True)
    tank_id = Column(Integer, ForeignKey("tanks.id"), nullable=False)
    task_type = Column(String, nullable=False)
    frequency_days = Column(Integer, nullable=False)
    last_done = Column(String, nullable=True)

    tank = relationship("TankORM", back_populates="maintenance_tasks")
