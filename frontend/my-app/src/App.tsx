import { useState, useEffect } from "react"
import { getTanks, getMaintenanceStatus } from "./assets/api"
import type { Tank, MaintenanceStatusEntry } from "./assets/types"
import { FishIcon } from "./assets/icons"
import TankCard from "./components/tankCard"

function App() {
  const [tanks, setTanks] = useState<Tank[]>([])
  const [status, setStatus] = useState<MaintenanceStatusEntry[]>([])

  useEffect(() => {
    getTanks().then((data) => {
      setTanks(data)
    })
    getMaintenanceStatus().then((data) => {
      setStatus(data)
    })
  }, [])

  return (
    <>
      <header className="flex items-center gap-2 p-4">
        <FishIcon size={32} className="bg-blue-500 text-white rounded-full" />
        <h1 className="text-xl font-bold">Aquarium Manager</h1>
      </header>

      <div className='grid gap-4 px-32'>
        {tanks.map((tank) => (
          <div key={tank.id}>
            <TankCard
              tank={tank}
              statuses={status.filter((entry) => entry.tank_id === tank.id)}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
