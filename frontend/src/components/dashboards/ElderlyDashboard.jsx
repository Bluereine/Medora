import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useMedications } from '../../context/MedicationContext'
import MedicationModal from '../medications/MedicationModal'
import DeleteConfirmModal from '../medications/DeleteConfirmModal'
import {
  HeartHandshake,
  Clock,
  Phone,
  Pill,
  CheckCircle2,
  Calendar,
  LogOut,
  ShieldCheck,
  Volume2,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react'

export default function ElderlyDashboard({ onLogout }) {
  const { userProfile, currentUser, logoutUser } = useAuth()
  const { medications, addMedication, updateMedication, deleteMedication } = useMedications()

  const [takenMeds, setTakenMeds] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMed, setSelectedMed] = useState(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [medToDelete, setMedToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Elderly Member'

  const handleLogout = async () => {
    await logoutUser()
    if (onLogout) onLogout()
  }

  const toggleTaken = (id) => {
    setTakenMeds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleOpenAdd = () => {
    setSelectedMed(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (med) => {
    setSelectedMed(med)
    setModalOpen(true)
  }

  const handleSaveMed = async (formData, id) => {
    if (id) {
      await updateMedication(id, formData)
    } else {
      await addMedication(formData)
    }
  }

  const handleOpenDelete = (med) => {
    setMedToDelete(med)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!medToDelete) return
    setDeleting(true)
    try {
      await deleteMedication(medToDelete.id)
      setDeleteModalOpen(false)
      setMedToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medora-seafoam/35 text-medora-deep text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-medora-aqua" />
            <span>Elderly Person Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-medora-dark tracking-tight">
            Welcome home, {displayName}!
          </h1>
          <p className="text-base text-medora-dark/70">
            Here is your simple, accessible daily care and medication overview.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Emergency SOS Button */}
          <button
            type="button"
            className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Phone className="w-6 h-6 animate-pulse" />
            <span>Call Caregiver (SOS)</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-3 rounded-2xl border border-medora-seafoam/80 bg-white hover:bg-medora-seafoam/20 text-medora-dark font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-medora-deep" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Role Verification & Security Notice */}
      <div className="p-4 rounded-2xl bg-medora-seafoam/20 border border-medora-seafoam/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-medora-deep shrink-0" />
          <div className="text-xs text-medora-dark">
            <span className="font-bold">Authorized Role:</span> Elderly Person • <span className="font-mono text-medora-deep">{userProfile?.email || currentUser?.email}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          Active Session
        </span>
      </div>

      {/* Today's Schedule Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-medora-seafoam/40 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-medora-dark">Today's Daily Schedule</h2>
            <p className="text-sm text-medora-dark/70">
              {medications.length} active {medications.length === 1 ? 'medication' : 'medications'} on your schedule.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-medora-seafoam/35 text-medora-deep font-semibold text-xs hover:bg-medora-seafoam/60 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Read Aloud</span>
            </button>
          </div>
        </div>

        {/* Dynamic Medication Schedule Cards */}
        {medications.length === 0 ? (
          <div className="p-8 text-center bg-medora-light/60 rounded-2xl border border-dashed border-medora-seafoam text-medora-dark/70 space-y-3">
            <Pill className="w-10 h-10 mx-auto text-medora-aqua opacity-60" />
            <p className="text-sm font-medium">No medications scheduled yet.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-medora-deep text-white text-xs font-bold hover:bg-medora-dark transition-colors cursor-pointer"
            >
              + Add Your First Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {medications.map((med) => {
              const isTaken = Boolean(takenMeds[med.id])
              return (
                <div
                  key={med.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isTaken
                      ? 'border-emerald-200 bg-emerald-50/50 opacity-90'
                      : 'border-2 border-medora-aqua bg-medora-seafoam/15'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        isTaken
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-medora-aqua/20 text-medora-deep'
                      }`}
                    >
                      {isTaken ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <Pill className="w-8 h-8" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-medora-aqua text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{med.reminderTime || '08:00 AM'}</span>
                        </span>
                        <span className="text-xs font-medium text-medora-dark/70">
                          {med.frequency}
                        </span>
                        {isTaken && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Taken Today
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-extrabold text-medora-dark">
                        {med.name} <span className="text-lg font-semibold text-medora-deep">({med.dosage})</span>
                      </h3>

                      <p className="text-sm text-medora-dark/80">
                        {med.instructions || med.pill}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* Edit Option */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(med)}
                      aria-label={`Edit ${med.name}`}
                      title="Edit Medication"
                      className="px-3.5 py-3 rounded-xl border border-medora-seafoam/80 bg-white hover:bg-medora-seafoam/25 text-medora-dark font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-medora-deep" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(med)}
                      aria-label={`Delete ${med.name}`}
                      title="Delete Medication"
                      className="px-3 py-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    {/* Mark as Taken */}
                    <button
                      type="button"
                      onClick={() => toggleTaken(med.id)}
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isTaken
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-medora-deep hover:bg-medora-dark text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{isTaken ? 'Marked as Taken' : 'Mark as Taken'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Medication Add/Edit Modal */}
      <MedicationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedMed(null)
        }}
        onSave={handleSaveMed}
        medication={selectedMed}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setMedToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        medicationName={medToDelete?.name || ''}
        loading={deleting}
      />

    </div>
  )
}
