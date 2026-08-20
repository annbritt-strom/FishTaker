from datetime import date, datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Tank, MaintenanceTask
import data

app = FastAPI(title="Fishtaker API")

# Allow the Vite dev server (default port 5173) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Fishtaker API is running"}

@app.get("/tanks", response_model=list[Tank])
def get_tanks():
    return data.tanks

@app.get("/tanks/{tank_id}", response_model=Tank)
def get_tank(tank_id: int):
    for tank in data.tanks:
        if tank.id == tank_id:
            return tank
    raise HTTPException(status_code=404, detail="Tank not found")

@app.post("/tanks", response_model=Tank)
def create_tank(tank: Tank):
    tank.id = data.next_tank_id
    data.next_tank_id += 1
    data.tanks.append(tank)
    return tank

@app.get("/maintenance", response_model=list[MaintenanceTask])
def get_maintenance_tasks():
    return data.maintenance_tasks

@app.get("/maintenance/status")
def get_maintenance_status():
    """Returns each task with whether it's overdue, due soon, or on track."""
    today = date.today()
    results = []
    for task in data.maintenance_tasks:
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
def complete_task(task_id: int):
    for task in data.maintenance_tasks:
        if task.id == task_id:
            task.last_done = date.today().isoformat()
            return task
    raise HTTPException(status_code=404, detail="Task not found")