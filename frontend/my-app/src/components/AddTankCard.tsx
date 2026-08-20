import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../assets/modal'
import { AddIcon } from '../assets/icons'
import { createTank } from '../assets/api'
import type { WaterType } from '../assets/types'

type AddTankCardProps = {
  onTankAdded?: () => void
}

const TEMP_MIN = 10
const TEMP_MAX = 35

const emptyForm = {
  name: '',
  height: '',
  width: '',
  depth: '',
  literCapacity: '',
  waterType: 'freshwater' as WaterType,
  tempMin: 22,
  tempMax: 26,
  planted: false,
}

const AddTankCard = ({ onTankAdded }: AddTankCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setIsOpen(false)
    setForm(emptyForm)
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { height, width, depth } = form
    const size = height && width && depth ? `${height}x${width}x${depth}` : undefined

    try {
      await createTank({
        name: form.name,
        size,
        liter_capacity: Number(form.literCapacity),
        water_type: form.waterType,
        temp_min: form.tempMin,
        temp_max: form.tempMax,
        planted: form.planted,
      })
      onTankAdded?.()
      handleClose()
    } catch {
      setError('Could not add tank. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}
        className="p-2 flex items-center justify-center rounded bg-blue-200">
        <AddIcon size={24} className="" />
      </button>

      <Modal open={isOpen} onClose={handleClose}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="form-item">
            <label className="form-label" htmlFor="tankName">Name your tank:</label>
            <input
              className="form-input" type="text" id="tankName" name="tankName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-item">
            <label className="form-label">Size (H x W x D, cm) — optional:</label>
            <div className="flex gap-2">
              <input
                className="form-input" type="number" min="0" placeholder="H"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
              <input
                className="form-input" type="number" min="0" placeholder="W"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
              />
              <input
                className="form-input" type="number" min="0" placeholder="D"
                value={form.depth}
                onChange={(e) => setForm({ ...form, depth: e.target.value })}
              />
            </div>
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="literCapacity">Liter capacity:</label>
            <input
              className="form-input" type="number" id="literCapacity" name="literCapacity"
              min="0"
              value={form.literCapacity}
              onChange={(e) => setForm({ ...form, literCapacity: e.target.value })}
              required
            />
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="waterType">Water type:</label>
            <select
              className="form-input" id="waterType" name="waterType"
              value={form.waterType}
              onChange={(e) => setForm({ ...form, waterType: e.target.value as WaterType })}
            >
              <option value="freshwater">Freshwater</option>
              <option value="saltwater">Saltwater</option>
            </select>
          </div>

          <div className="form-item">
            <label className="form-label">
              Temperature range: {form.tempMin}°C – {form.tempMax}°C
            </label>
            <div className="range-slider">
              <div className="range-slider__track" />
              <div
                className="range-slider__fill"
                style={{
                  left: `${((form.tempMin - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100}%`,
                  right: `${100 - ((form.tempMax - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100}%`,
                }}
              />
              <input
                className="range-slider__input" style={{ zIndex: 3 }}
                type="range" min={TEMP_MIN} max={TEMP_MAX} step="0.5"
                value={form.tempMin}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setForm({ ...form, tempMin: Math.min(value, form.tempMax) })
                }}
              />
              <input
                className="range-slider__input" style={{ zIndex: 4 }}
                type="range" min={TEMP_MIN} max={TEMP_MAX} step="0.5"
                value={form.tempMax}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setForm({ ...form, tempMax: Math.max(value, form.tempMin) })
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox" id="planted" name="planted"
              checked={form.planted}
              onChange={(e) => setForm({ ...form, planted: e.target.checked })}
            />
            <label className="form-label" htmlFor="planted">Planted tank</label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button type="button" className="action-btn bg-gray-500 text-white" onClick={handleClose}>
              Cancel
            </button>
            <button className="action-btn bg-blue-500 text-white" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : '+ Add Tank'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AddTankCard
