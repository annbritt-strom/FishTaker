import { useState } from "react"
import AddTankModal from "./AddTankModal"
import EditTankModal from "./EditTankModal"
import EmptyTanksState from "./EmptyTanksState"
import TankCard from "./TankCard"
import type { MaintenanceStatusEntry, Tank } from "../assets/types"

type TanksSectionProps = {
  tanks: Tank[]
  statuses: MaintenanceStatusEntry[]
  onTanksChanged?: () => void
}

const TanksSection = ({ tanks, statuses, onTanksChanged }: TanksSectionProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingTank, setEditingTank] = useState<Tank | null>(null)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
      {tanks.length > 0 && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Your Tanks</h2>
            <p className="mt-1 text-sm text-slate-500">Keep an eye on your underwater world.</p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            + Add Tank
          </button>
        </div>
      )}

      <div className={tanks.length > 0 ? "mt-8" : undefined}>
        {tanks.length === 0 ? (
          <EmptyTanksState onCreateTank={() => setIsAddOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tanks.map((tank) => (
              <TankCard
                key={tank.id}
                tank={tank}
                statuses={statuses.filter((entry) => entry.tank_id === tank.id)}
                onEdit={() => setEditingTank(tank)}
              />
            ))}
          </div>
        )}
      </div>

      <AddTankModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onTankAdded={onTanksChanged}
      />

      <EditTankModal
        tank={editingTank}
        onClose={() => setEditingTank(null)}
        onTankUpdated={onTanksChanged}
      />
    </div>
  )
}

export default TanksSection
