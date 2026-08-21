import { useState } from "react"
import AddTankModal from "./AddTankModal"
import EmptyTanksState from "./EmptyTanksState"
import TankCard from "./TankCard"
import type { MaintenanceStatusEntry, Tank } from "../assets/types"

type TanksSectionProps = {
  tanks: Tank[]
  statuses: MaintenanceStatusEntry[]
  onTankAdded?: () => void
}

const TanksSection = ({ tanks, statuses, onTankAdded }: TanksSectionProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Your Tanks</h2>
          <p className="mt-1 text-sm text-slate-500">Keep an eye on your underwater world.</p>
        </div>

        {tanks.length > 0 && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            + Add Tank
          </button>
        )}
      </div>

      <div className="mt-8">
        {tanks.length === 0 ? (
          <EmptyTanksState onCreateTank={() => setIsAddOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tanks.map((tank) => (
              <TankCard
                key={tank.id}
                tank={tank}
                statuses={statuses.filter((entry) => entry.tank_id === tank.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddTankModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onTankAdded={onTankAdded}
      />
    </div>
  )
}

export default TanksSection
