import type { MaintenanceStatus, MaintenanceStatusEntry, Tank } from '../assets/types'
import { EditIcon } from '../assets/icons'
import StatusBadge from './StatusBadge'
import { DetailedFishIcon, PlantIcon, ThermometerIcon } from '../assets/icons'

type TankCardProps = {
    tank: Tank,
    statuses?: MaintenanceStatusEntry[]
    onEdit?: () => void
}

const statusPriority: Record<MaintenanceStatus, number> = {
  overdue: 0,
  due_soon: 1,
  on_track: 2,
}

const overallStatus = (statuses: MaintenanceStatusEntry[]) => {
  if (statuses.length === 0) {
    return { label: 'No tasks yet', dotClassName: 'bg-slate-300' }
  }
  if (statuses.some((entry) => entry.status === 'overdue')) {
    return { label: 'Needs attention', dotClassName: 'bg-red-500' }
  }
  if (statuses.some((entry) => entry.status === 'due_soon')) {
    return { label: 'Due soon', dotClassName: 'bg-amber-500' }
  }
  return { label: 'Good', dotClassName: 'bg-emerald-500' }
}

const nextMaintenance = (statuses: MaintenanceStatusEntry[]) => {
  if (statuses.length === 0) return null
  return [...statuses].sort((a, b) => statusPriority[a.status] - statusPriority[b.status])[0]
}

const waterVisualClass: Record<Tank['water_type'], string> = {
  freshwater: 'from-sky-200 via-sky-100 to-sky-50',
  saltwater: 'from-cyan-200 via-teal-100 to-sky-50',
}

const COOL_WARM_THRESHOLD = 22

const TankCard = ({ tank, statuses = [], onEdit }: TankCardProps) => {
  const hasTempRange = tank.temp_min != null || tank.temp_max != null
  const avgTemp = tank.temp_min != null && tank.temp_max != null
    ? (tank.temp_min + tank.temp_max) / 2
    : tank.temp_min ?? tank.temp_max
  const tempIconClassName = avgTemp != null && avgTemp > COOL_WARM_THRESHOLD ? 'text-red-400' : 'text-blue-400'
  const fishCount = (tank.inhabitants ?? []).reduce((sum, inhabitant) => sum + inhabitant.amount, 0)
  const status = overallStatus(statuses)
  const nextTask = nextMaintenance(statuses)

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* aquarium visual */}
      <div className={`relative h-28 overflow-hidden ${tank.image ? '' : `bg-gradient-to-b ${waterVisualClass[tank.water_type]}`}`}>
        {tank.image ? (
          <img src={tank.image} alt={tank.name} className="h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-x-0 top-3 flex justify-center opacity-70">
              <svg viewBox="0 0 200 20" className="h-4 w-3/4" fill="none">
                <path d="M0 10 Q17 4 34 10 T68 10 T102 10 T136 10 T170 10 T200 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <svg viewBox="0 0 32 16" className="absolute bottom-4 left-8 h-4 w-8 fill-orange-400/90">
              <path d="M0 8s8-7 16-2c-8 7-16 2-16 2" />
            </svg>
            <svg viewBox="0 0 32 16" className="absolute bottom-6 right-12 h-3 w-6 fill-white/70">
              <path d="M0 8s8-7 16-2c-8 7-16 2-16 2" />
            </svg>
          </>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 backdrop-blur-sm">
          {tank.water_type === 'freshwater' ? 'Freshwater' : 'Saltwater'}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label="Edit tank"
            className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-600 opacity-0 backdrop-blur-sm transition-opacity hover:bg-white group-hover:opacity-100"
          >
            <EditIcon size={14} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-800">{tank.name}</h3>
            <p className="text-xs text-slate-500">
              {tank.liter_capacity} L · {tank.water_type === 'freshwater' ? 'Freshwater' : 'Saltwater'}
            </p>
          </div>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-slate-600">
            <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
            {status.label}
          </span>
        </div>

        <div className="mt-3  flex flex-wrap justify-between gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1"><DetailedFishIcon size={14} className="mr-1 text-orange-400" /> {fishCount} Fish</span>
          {hasTempRange && (
            <span className="inline-flex items-center gap-1">
              <ThermometerIcon size={14} className={`mr-1 ${tempIconClassName}`} /> {tank.temp_min ?? '?'}–{tank.temp_max ?? '?'}°C
            </span>
          )}
          <span className="inline-flex items-center gap-1"><PlantIcon size={14} className={`mr-1 ${tank.planted ? 'text-green-400' : 'text-slate-300'}`} /> {tank.planted ? 'Planted' : 'Unplanted'}</span>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Next maintenance</p>
          {nextTask ? (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm capitalize text-slate-700">{nextTask.task_type}</span>
              <StatusBadge status={nextTask.status} />
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-400">Nothing scheduled</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TankCard
