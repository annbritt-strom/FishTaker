const BASE_URL = "http://localhost:8000";

export async function getTanks() {
    const res = await fetch(`${BASE_URL}/tanks`)
    if (!res.ok) throw new Error("Failed to fetch tanks")
    return res.json()
}

export async function getMaintenanceStatus () {
    const res = await fetch(`${BASE_URL}/maintenance/status`)
    if (!res.ok) throw new Error("Failed to fetch maintenance status")
    return res.json()
}