import type { MaintenanceStatus } from '../assets/types'

const statusConfig = {
    overdue: {
        label: "Overdue",
        dotClassName: "bg-red-500",
        textClassName: "text-red-600",
    },
    due_soon: {
        label: "Due soon",
        dotClassName: "bg-amber-500",
        textClassName: "text-amber-600",
    },
    on_track: {
        label: "On track",
        dotClassName: "bg-emerald-500",
        textClassName: "text-emerald-600",
    }
}

const StatusBadge = ({ status }: { status: MaintenanceStatus }) => {
    const { label, dotClassName, textClassName } = statusConfig[status]

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${textClassName}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />
        {label}
      </span>
    )
}

export default StatusBadge
