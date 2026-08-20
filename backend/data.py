from models import Tank, Inhabitant, MaintenanceTask, WaterType

tanks: list[Tank] = [
    Tank(
        id=1,
        name="Community Tank",
        size="60x30x36cm",
        liter_capacity=60,
        water_type=WaterType.freshwater,
        temp_min=24,
        temp_max=26,
        planted=True,
        inhabitants=[
            Inhabitant(
                id=1,
                common_name="Neon Tetra",
                family_name="Characidae",
                temp_min=20,
                temp_max=26,
                schooling=True,
                amount=8,
                tank_level="middle",
            ),
            Inhabitant(
                id=2,
                common_name="Bristlenose Pleco",
                temp_min=22,
                temp_max=27,
                schooling=False,
                amount=1,
                tank_level="bottom",
            ),
        ],
    ),
    Tank(
        id=2,
        name="Saltwater Reef",
        size="90x45x45cm",
        liter_capacity=180,
        water_type=WaterType.saltwater,
        temp_min=24,
        temp_max=27,
        planted=False,
        inhabitants=[],
    ),
]

maintenance_tasks: list[MaintenanceTask] = [
    MaintenanceTask(
        id=1,
        tank_id=1,
        task_type="Water change",
        frequency_days=7,
        last_done="2026-08-29",
    ),
    MaintenanceTask(
        id=2,
        tank_id=1,
        task_type="Filter clean",
        frequency_days=30,
        last_done="2026-07-25",
    ),
    MaintenanceTask(
        id=3,
        tank_id=2,
        task_type="Water change",
        frequency_days=10,
        last_done=None,
    ),
]

# simple counters for generating new ids when adding via POST
next_tank_id = 3
next_inhabitant_id = 3
next_task_id = 4