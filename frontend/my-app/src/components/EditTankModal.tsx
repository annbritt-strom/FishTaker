import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../assets/modal'
import { CameraIcon, XIcon } from '../assets/icons'
import { updateTank } from '../assets/api'
import { fileToResizedDataUrl } from '../assets/imageUtils'
import type { Tank, WaterType } from '../assets/types'

type EditTankModalProps = {
  tank: Tank | null
  onClose: () => void
  onTankUpdated?: () => void
}

const TEMP_MIN = 10
const TEMP_MAX = 35

const waterTypeOptions: { value: WaterType; label: string }[] = [
  { value: 'freshwater', label: 'Freshwater' },
  { value: 'saltwater', label: 'Saltwater' },
]

const formFromTank = (tank: Tank) => {
  const [height = '', width = '', depth = ''] = (tank.size ?? '').split('x')
  return {
    name: tank.name,
    height,
    width,
    depth,
    literCapacity: String(tank.liter_capacity),
    waterType: tank.water_type,
    tempMin: tank.temp_min ?? 22,
    tempMax: tank.temp_max ?? 26,
    planted: tank.planted,
    image: tank.image ?? null,
  }
}

const EditTankModal = ({ tank, onClose, onTankUpdated }: EditTankModalProps) => {
  const [form, setForm] = useState(() => tank ? formFromTank(tank) : null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(tank ? formFromTank(tank) : null)
    setError(null)
  }, [tank])

  if (!tank || !form) return null

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setForm({ ...form, image: dataUrl })
    } catch {
      setError('Could not load that image. Try a different file.')
    } finally {
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { height, width, depth } = form
    const size = height && width && depth ? `${height}x${width}x${depth}` : undefined

    try {
      await updateTank(tank.id, {
        name: form.name,
        size,
        liter_capacity: Number(form.literCapacity),
        water_type: form.waterType,
        temp_min: form.tempMin,
        temp_max: form.tempMax,
        planted: form.planted,
        image: form.image,
      })
      onTankUpdated?.()
      onClose()
    } catch {
      setError('Could not save changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={!!tank} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold text-slate-800">Edit tank</h3>

        <div className="form-item">
          <label className="form-label">Tank photo</label>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {form.image ? (
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <CameraIcon size={20} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {form.image ? 'Replace photo' : 'Upload photo'}
            </button>
            {form.image && (
              <button
                type="button"
                onClick={() => setForm({ ...form, image: null })}
                className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-500"
              >
                <XIcon size={14} /> Remove
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="editTankName">Tank name</label>
          <input
            className="form-input" type="text" id="editTankName"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="editLiterCapacity">Volume (liters)</label>
          <input
            className="form-input" type="number" id="editLiterCapacity"
            min="0"
            value={form.literCapacity}
            onChange={(e) => setForm({ ...form, literCapacity: e.target.value })}
            required
          />
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="editWaterType">Water type</label>
          <select
            className="form-input" id="editWaterType"
            value={form.waterType}
            onChange={(e) => setForm({ ...form, waterType: e.target.value as WaterType })}
          >
            {waterTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-item">
          <label className="form-label">Dimensions (H × W × D, cm) — optional</label>
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
            type="checkbox" id="editPlanted"
            checked={form.planted}
            onChange={(e) => setForm({ ...form, planted: e.target.checked })}
          />
          <label className="form-label" htmlFor="editPlanted">Planted tank</label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 mt-2">
          <button type="button" className="action-btn bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={onClose}>
            Cancel
          </button>
          <button className="action-btn bg-orange-500 text-white hover:bg-orange-600" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditTankModal
