export type WaterType = "freshwater" | "saltwater";

export type Inhabitant = {
    id: number
    common_name: string
    family_name?: string | null
    temp_min: number
    schooling: boolean
    amount: number
    tank_level?: string | null
}

export type Tank = {
    id: number
    name: string
    size: string
    liter_capacity: number
    water_type: WaterType
    temp_min?: number | null
    temp_max?: number | null
    planted: boolean
    inhabitants?: Inhabitant[]
}

export type TankCreate = {
    name: string
    size?: string
    liter_capacity: number
    water_type: WaterType
    temp_min?: number | null
    temp_max?: number | null
    planted: boolean
}

export type MaintenanceStatus = "overdue" | "due_soon" | "on_track"

export type MaintenanceStatusEntry = {
    task_id: number
    tank_id: number
    task_type: string
    days_since_last: number | null
    status: MaintenanceStatus
}