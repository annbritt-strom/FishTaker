import { useState, useEffect } from "react"
import { getTanks, getMaintenanceStatus } from "./assets/api"
import type { Tank, MaintenanceStatusEntry } from "./assets/types"
import Header from "./components/Header"
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
    <div className='min-h-screen bg-slate-50'>
      <Header />
      <TanksSection tanks={tanks} statuses={status} onTanksChanged={refreshTanks} />
    </div>
  )
}

export default App
