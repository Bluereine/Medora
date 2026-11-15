import { useState, useEffect } from 'react'
import { X, Pill, Clock, AlertCircle, Save, Plus } from 'lucide-react'

export default function MedicationModal({
  isOpen,
  onClose,
  onSave,
  medication = null
}) {
  const isEditing = Boolean(medication && medication.id)

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily in the morning',
    reminderTime: '08:00 AM',
    pill: 'White oval tablet',
    instructions: 'Take with food',
    remaining: 30
  })

  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Populate form with existing details when editing
  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name || '',
        dosage: medication.dosage || '',
        frequency: medication.frequency || 'Once daily in the morning',
        reminderTime: medication.reminderTime || '08:00 AM',
        pill: medication.pill || 'White oval tablet',
        instructions: medication.instructions || 'Take with food',
        remaining: medication.remaining !== undefined ? medication.remaining : 30
      })
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Once daily in the morning',
        reminderTime: '08:00 AM',
        pill: 'White oval tablet',
        instructions: 'Take with food',
        remaining: 30
      })
    }
    setError(null)
  }, [medication, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'remaining' ? Math.max(0, parseInt(value, 10) || 0) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Medication name is required.')
      return
    }
    if (!formData.dosage.trim()) {
      setError('Dosage is required (e.g., 500 mg, 10 ml).')
      return
    }
    if (!formData.frequency.trim()) {
      setError('Dosage frequency is required.')
      return
    }
    if (!formData.reminderTime.trim()) {
      setError('Reminder time is required.')
      return
    }

    setSubmitting(true)
    try {
      await onSave(formData, medication?.id)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save medication.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-medora-dark/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-medora-seafoam/60 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-medora-seafoam/40 bg-medora-light/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-medora-seafoam/50 text-medora-deep flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-xl font-bold text-medora-dark">
                {isEditing ? 'Edit Medication' : 'Add New Medication'}
              </h3>
              <p className="text-xs text-medora-dark/70">
                {isEditing ? 'Update existing medicine schedule & details' : 'Enter medicine prescription details'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-medora-dark/60 hover:text-medora-dark hover:bg-medora-seafoam/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Medicine Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Metformin, Lisinopril"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Dosage / Strength *
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 500 mg, 10 mg"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>

            {/* Reminder Time */}
            <div>
              <label className="block text-xs font-bold text-medora-dark mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-medora-aqua" />
                <span>Reminder Time *</span>
              </label>
              <input
                type="text"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                placeholder="e.g. 08:00 AM, 08:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>

            {/* Frequency */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Frequency *
              </label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g. Twice daily with meals, Once daily in morning"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>

            {/* Pill Description */}
            <div>
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Pill Appearance / Guide
              </label>
              <input
                type="text"
                name="pill"
                value={formData.pill}
                onChange={handleChange}
                placeholder="e.g. White oval tablet"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
              />
            </div>

            {/* Remaining Count */}
            <div>
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Remaining Pills
              </label>
              <input
                type="number"
                name="remaining"
                min="0"
                value={formData.remaining}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
              />
            </div>

            {/* Instructions */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-medora-dark mb-1">
                Instructions / Notes
              </label>
              <input
                type="text"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="e.g. Take with breakfast, Avoid taking on empty stomach"
                className="w-full px-4 py-2.5 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-medora-seafoam/40">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-medora-seafoam/80 text-medora-dark hover:bg-medora-seafoam/20 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{submitting ? 'Saving...' : isEditing ? 'Update Medicine' : 'Add Medicine'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
