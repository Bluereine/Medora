import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  medicationName,
  loading = false
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-medora-dark/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-rose-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="p-1.5 rounded-lg text-medora-dark/50 hover:text-medora-dark transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 id="delete-dialog-title" className="text-xl font-bold text-medora-dark">
              Delete Medication?
            </h3>
            <p className="text-sm text-medora-dark/75 leading-relaxed">
              Are you sure you want to remove <strong className="text-medora-dark font-semibold">"{medicationName}"</strong> from your prescriptions and schedule? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-medora-seafoam/80 text-medora-dark hover:bg-medora-seafoam/20 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
