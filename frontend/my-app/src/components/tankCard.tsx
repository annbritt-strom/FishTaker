import type { MaintenanceStatusEntry, Tank } from '../assets/types'
import StatusBadge from './statusBadge'

type TankCardProps = {
    tank: Tank,
    statuses?: MaintenanceStatusEntry[]
}

const TankCard = ({ tank, statuses = [] }: TankCardProps) => {
  const hasTempRange = tank.temp_min != null || tank.temp_max != null

  return (
    <div className='bg-blue-100 p-4 rounded-lg shadow-md'>
        <div className='flex items-center gap-2'>  
            <h2 className='text-xl font-semibold'>{tank.name}</h2>
        </div>

      {statuses.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-2'>
          {statuses.map((entry) => (
            <div key={entry.task_id} className='flex items-center gap-1 text-sm'>
              <span>{entry.task_type}:</span>
              <StatusBadge status={entry.status} />
            </div>
          ))}
        </div>
      )}

      <dl className='mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700'>
        <div>
          <dt className='inline font-medium'>Size: </dt>
          <dd className='inline'>{tank.size}</dd>
        </div>
        <div>
          <dt className='inline font-medium'>Capacity: </dt>
          <dd className='inline'>{tank.liter_capacity} L</dd>
        </div>
        <div>
          <dt className='inline font-medium'>Water: </dt>
          <dd className='inline capitalize'>{tank.water_type}</dd>
        </div>
        {hasTempRange && (
          <div>
            <dt className='inline font-medium'>Temp: </dt>
            <dd className='inline'>
              {tank.temp_min ?? "?"}–{tank.temp_max ?? "?"}°C
            </dd>
          </div>
        )}
        <div>
          <dt className='inline font-medium'>Planted: </dt>
          <dd className='inline'>{tank.planted ? "Yes" : "No"}</dd>
        </div>
      </dl>
    </div>
  )
}

export default TankCard
