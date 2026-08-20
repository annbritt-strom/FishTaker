import { useState, useEffect } from "react"
import { getTanks, getMaintenanceStatus } from "./assets/api"
import type { Tank, MaintenanceStatusEntry } from "./assets/types"
import Header from "./components/Header"
import TankCard from "./components/TankCard"
import TanksSection from "./components/TanksSection"

function App() {
  const [tanks, setTanks] = useState<Tank[]>([])
  const [status, setStatus] = useState<MaintenanceStatusEntry[]>([])

  const refreshTanks = () => {
    getTanks().then((data) => {
      setTanks(data)
    })
  }

  useEffect(() => {
    refreshTanks()
    getMaintenanceStatus().then((data) => {
      setStatus(data)
    })
  }, [])

  return (
    <div className='min-h-screen bg-slate-100'>
      <Header />

      <div>
        <TanksSection onTankAdded={refreshTanks} />
      </div>

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
    </div>
  )
}

export default App
