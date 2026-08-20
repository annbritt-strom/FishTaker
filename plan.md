# The Fishtaker
This webapp aims to help fishkeeping easier by being able to log each tank a user has, input information about their tanks and be able to set a schedule that lets them know when its time to do some maintainance or if they are late on upkeep.

## Technologies:
#### Frontend:
- React Vite
- Tailwind

#### Backend:
- Python (FastAPI + uvicorn)

* I plan to use dummy data and no databases as I do not have enough time in three days

---

## Progress tracker
Check items off as they're implemented. Update this section whenever a feature lands so it stays a source of truth for what's done vs. outstanding.

### 1. Tanks & inhabitants

**Backend**
- [x] `Tank` model — size, liter capacity, water type, temp range (optional), planted (`backend/models.py`)
- [x] `Inhabitant` model — common name, family name, schooling, amount, tank level
- [ ] `Inhabitant.temp_max` — model only has `temp_min`, plan calls for a full temp range
- [ ] `Inhabitant.ph_level` — not on the model yet
- [x] `GET /tanks`, `GET /tanks/{tank_id}`
- [x] `POST /tanks`
- [ ] `PUT /tanks/{tank_id}` (edit tank)
- [ ] `DELETE /tanks/{tank_id}`
- [ ] Endpoints to add/edit/remove an inhabitant on a tank (currently inhabitants can only be set via the initial `POST /tanks` payload)

**Frontend**
- [x] Vite + React + Tailwind scaffold
- [x] `getTanks()` API call + tank list rendering (`App.tsx`, `components/tankCard.tsx`)
- [ ] Tank detail view (show inhabitants, temp range, water type, etc. — card currently only shows the name)
- [ ] Add tank form
- [ ] Add/edit inhabitant form

### 2. Maintenance scheduling

**Backend**
- [x] `MaintenanceTask` model, per-tank via `tank_id` (`backend/models.py`)
- [x] `GET /maintenance` (all tasks, all tanks)
- [ ] `GET /tanks/{tank_id}/maintenance` — filter tasks by tank so the frontend can show a schedule per tank
- [ ] `POST /maintenance` — create a new task for a tank
- [ ] `PUT /maintenance/{task_id}` / `DELETE /maintenance/{task_id}` — edit or remove a task
- [x] `GET /maintenance/status` — overdue / due soon / on track logic
- [x] `POST /maintenance/{task_id}/complete`
- [ ] Maintenance log/history — currently only a single `last_done` date is kept per task, no history of past completions

**Frontend**
- [ ] Maintenance schedule UI (per-tank list of tasks with overdue/due-soon/on-track status)
- [ ] Add task form
- [ ] "Mark complete" action
- [ ] Maintenance log/history view

---

## Feature notes
1. Add tank and details about it. The available inputs are divided into two main areas, base tank details and inhabitants:
    Base tank details:
    - Tank size
    - Liter capacity
    - Water type
    - Temperature range (optional)
    - Planted tank

    Inhabitants:
    - Common name
    - Family name (optional)
    - Temperature range
    - Ph level
    - Schooling fish?
    - Amount
    - Which level of the tank they occupy (optional)

2. The user can set a schedule for when their tank needs to be maintained, per tank.
    - They will be reminded when its time to maintain the tank soon
    - There will be a way to let the user know if they're late in maintaining their tank
    - A maintenance log

## Future features:
    - Statistics of ...
    - Being able to add a photo of their tanks
    - Input which plants are in the tank, and just like the fish species, input what details about their care necessities. Probably will be named under an area called vegetation when user has clicked in if tank is a planted one.
    - A fish wishlist where user can add a fish into their wishlist, where the app can recognize if the fish is compatible or can live comfortably or not in one of the users tanks or not. Added detail to fish: prefers horizontal spaces or not.
    - User can choose which to see on their dashboard first, customizabilty is key.
