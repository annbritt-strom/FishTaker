import type { MaintenanceStatus } from '../assets/types'

const statusConfig = {
    overdue: { 
        label: "Overdue",
        className: "bg-red-500", 
    },
    due_soon: { 
        label: "Due Soon",
        className: "bg-yellow-500" 
    },
    on_track: { 
        label: "On Track",
        className: "bg-green-500" 
    }
}

const StatusBadge = ({status}: {status: MaintenanceStatus}) => {
    const { label, className } = statusConfig[status]

    return (
    <div>
      <span className={`${className} text-white px-2 py-1 rounded`}>
        {label}
      </span>
    </div>
  )
}

export default StatusBadge