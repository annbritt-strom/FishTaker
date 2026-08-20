from sqlalchemy.orm import Session

from db_models import InhabitantORM, MaintenanceTaskORM, TankORM


def seed_if_empty(db: Session) -> None:
    """Populates a couple of sample tanks on first run against an empty database."""
    if db.query(TankORM).first() is not None:
        return

    community_tank = TankORM(
        name="Community Tank",
        size="60x30x36cm",
        liter_capacity=60,
        water_type="freshwater",
        temp_min=24,
        temp_max=26,
        planted=True,
        inhabitants=[
            InhabitantORM(
                common_name="Neon Tetra",
                family_name="Characidae",
                temp_min=20,
                schooling=True,
                amount=8,
                tank_level="middle",
            ),
            InhabitantORM(
                common_name="Bristlenose Pleco",
                temp_min=22,
                schooling=False,
                amount=1,
                tank_level="bottom",
            ),
        ],
    )
    reef_tank = TankORM(
        name="Saltwater Reef",
        size="90x45x45cm",
        liter_capacity=180,
        water_type="saltwater",
        temp_min=24,
        temp_max=27,
        planted=False,
    )
    db.add_all([community_tank, reef_tank])
    db.flush()  # assigns ids so we can reference them below

    db.add_all([
        MaintenanceTaskORM(
            tank_id=community_tank.id,
            task_type="Water change",
            frequency_days=7,
            last_done="2026-08-29",
        ),
        MaintenanceTaskORM(
            tank_id=community_tank.id,
            task_type="Filter clean",
            frequency_days=30,
            last_done="2026-07-25",
        ),
        MaintenanceTaskORM(
            tank_id=reef_tank.id,
            task_type="Water change",
            frequency_days=10,
            last_done=None,
        ),
    ])
    db.commit()
