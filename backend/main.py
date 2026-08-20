from datetime import date, datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine, get_db
from db_models import InhabitantORM, MaintenanceTaskORM, TankORM
from models import MaintenanceTask, Tank, TankCreate
from seed import seed_if_empty

app = FastAPI(title="Fishtaker API")

# Allow the Vite dev server (default port 5173) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Fishtaker API is running"}


@app.get("/tanks", response_model=list[Tank])
def get_tanks(db: Session = Depends(get_db)):
    return db.query(TankORM).all()


@app.get("/tanks/{tank_id}", response_model=Tank)
def get_tank(tank_id: int, db: Session = Depends(get_db)):
    tank = db.get(TankORM, tank_id)
    if tank is None:
        raise HTTPException(status_code=404, detail="Tank not found")
    return tank


@app.post("/tanks", response_model=Tank)
def create_tank(tank: TankCreate, db: Session = Depends(get_db)):
    tank_row = TankORM(
        name=tank.name,
        size=tank.size,
        liter_capacity=tank.liter_capacity,
        water_type=tank.water_type,
        temp_min=tank.temp_min,
        temp_max=tank.temp_max,
        planted=tank.planted,
        inhabitants=[
            InhabitantORM(**inhabitant.model_dump()) for inhabitant in tank.inhabitants
        ],
    )
    db.add(tank_row)
    db.commit()
    db.refresh(tank_row)
    return tank_row


@app.get("/maintenance", response_model=list[MaintenanceTask])
def get_maintenance_tasks(db: Session = Depends(get_db)):
    return db.query(MaintenanceTaskORM).all()


@app.get("/maintenance/status")
def get_maintenance_status(db: Session = Depends(get_db)):
    """Returns each task with whether it's overdue, due soon, or on track."""
    today = date.today()
    results = []
    for task in db.query(MaintenanceTaskORM).all():
        if task.last_done is None:
            status = "overdue"
            days_since = None
        else:
            last_done_date = datetime.strptime(task.last_done, "%Y-%m-%d").date()
            days_since = (today - last_done_date).days
            if days_since > task.frequency_days:
                status = "overdue"
            elif days_since >= task.frequency_days - 2:
                status = "due_soon"
            else:
                status = "on_track"
        results.append({
            "task_id": task.id,
            "tank_id": task.tank_id,
            "task_type": task.task_type,
            "days_since_last": days_since,
            "status": status,
        })
    return results


@app.post("/maintenance/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(MaintenanceTaskORM, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.last_done = date.today().isoformat()
    db.commit()
    db.refresh(task)
    return task
