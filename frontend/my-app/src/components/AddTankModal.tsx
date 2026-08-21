import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../assets/modal'
import { CameraIcon, XIcon } from '../assets/icons'
import { createTank } from '../assets/api'
import { fileToResizedDataUrl } from '../assets/imageUtils'
import type { WaterType } from '../assets/types'

type AddTankModalProps = {
  open: boolean
  onClose: () => void
  onTankAdded?: () => void
}

const TEMP_MIN = 10
const TEMP_MAX = 35

const waterTypeOptions: { value: WaterType; label: string; emoji: string; description: string }[] = [
  { value: 'freshwater', label: 'Freshwater', emoji: '🐟', description: 'Rivers, lakes & planted tanks' },
  { value: 'saltwater', label: 'Saltwater', emoji: '🪸', description: 'Reef & marine setups' },
]

const emptyForm = {
  name: '',
  height: '',
  width: '',
  depth: '',
  literCapacity: '',
  waterType: '' as WaterType | '',
  tempMin: 22,
  tempMax: 26,
  planted: false,
  image: null as string | null,
}

const AddTankModal = ({ open, onClose, onTankAdded }: AddTankModalProps) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setForm((prev) => ({ ...prev, image: dataUrl }))
    } catch {
      setError('Could not load that image. Try a different file.')
    } finally {
      e.target.value = ''
    }
  }

  const handleClose = () => {
    onClose()
    setStep(1)
    setForm(emptyForm)
    setError(null)
  }

  const handleSelectWaterType = (waterType: WaterType) => {
    setForm({ ...form, waterType })
    setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.waterType) return
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
        image: form.image,
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
    <Modal open={open} onClose={handleClose}>
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Create your tank</h3>
            <p className="mt-1 text-sm text-slate-500">What kind of tank are you setting up?</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {waterTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectWaterType(option.value)}
                className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-orange-300 hover:bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                <span className="font-semibold text-slate-800">{option.label}</span>
                <span className="text-xs text-slate-500">{option.description}</span>
              </button>
            ))}
          </div>

          <button type="button" className="action-btn bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={handleClose}>
            Cancel
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              ← Back
            </button>
            <h3 className="mt-1 text-lg font-bold text-slate-800">Tank details</h3>
            <p className="mt-1 text-sm text-slate-500">
              {form.waterType === 'freshwater' ? 'Freshwater' : 'Saltwater'} tank
            </p>
          </div>

          <div className="form-item">
            <label className="form-label">Tank photo — optional</label>
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
            <label className="form-label" htmlFor="tankName">Name your tank</label>
            <input
              className="form-input" type="text" id="tankName" name="tankName"
              placeholder="e.g. Community Tank"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="literCapacity">Volume (liters)</label>
            <input
              className="form-input" type="number" id="literCapacity" name="literCapacity"
              min="0"
              value={form.literCapacity}
              onChange={(e) => setForm({ ...form, literCapacity: e.target.value })}
              required
            />
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
              type="checkbox" id="planted" name="planted"
              checked={form.planted}
              onChange={(e) => setForm({ ...form, planted: e.target.checked })}
            />
            <label className="form-label" htmlFor="planted">Planted tank</label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button type="button" className="action-btn bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={handleClose}>
              Cancel
            </button>
            <button className="action-btn bg-orange-500 text-white hover:bg-orange-600" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : '+ Add Tank'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default AddTankModal
