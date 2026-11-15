import { useAuth } from '../../context/AuthContext'
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Pill,
  LogOut,
  Calendar,
  AlertTriangle
} from 'lucide-react'

export default function CaretakerDashboard({ onLogout }) {
  const { userProfile, currentUser, logoutUser } = useAuth()
  const displayName = userProfile?.fullName || currentUser?.displayName || 'Caretaker'

  const handleLogout = async () => {
    await logoutUser()
    if (onLogout) onLogout()
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medora-seafoam/35 text-medora-deep text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-medora-aqua" />
            <span>Caretaker Management Station</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-medora-dark tracking-tight">
            Welcome, {displayName}!
          </h1>
          <p className="text-base text-medora-dark/70">
            Monitor daily rosters, administer medication tasks, and record senior compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-5 py-3 rounded-2xl border border-medora-seafoam/80 bg-white hover:bg-medora-seafoam/20 text-medora-dark font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <LogOut className="w-4 h-4 text-medora-deep" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Role Verification & Security Notice */}
      <div className="p-4 rounded-2xl bg-medora-seafoam/20 border border-medora-seafoam/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-medora-deep shrink-0" />
          <div className="text-xs text-medora-dark">
            <span className="font-bold">Authorized Role:</span> Caretaker • <span className="font-mono text-medora-deep">{userProfile?.email || currentUser?.email}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          Active Session
        </span>
      </div>

      {/* Patient Care Roster & Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-medora-seafoam/40 pb-4">
            <div>
              <h2 className="text-xl font-bold text-medora-dark">Assigned Care Roster</h2>
              <p className="text-xs text-medora-dark/70">Seniors under your care shift today</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-medora-seafoam/40 text-medora-deep">
              1 Active Resident
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-medora-seafoam/70 bg-medora-light flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-medora-seafoam/50 text-medora-deep font-bold flex items-center justify-center">
                EM
              </div>
              <div>
                <h3 className="font-bold text-medora-dark text-base">Eleanor Miller</h3>
                <p className="text-xs text-medora-dark/70">Room 204 • Next Dose: 8:00 PM</p>
              </div>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-medora-deep hover:bg-medora-dark text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Log Care Note
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-medora-deep font-bold text-sm">
            <Clock className="w-4 h-4 text-medora-aqua" />
            <span>Shift Highlights</span>
          </div>
          <div className="space-y-3 text-xs text-medora-dark/80">
            <div className="p-3 rounded-xl bg-medora-seafoam/20 border border-medora-seafoam/40">
              <span className="font-bold text-medora-dark block">8:05 AM</span>
              Morning medications administered & confirmed.
            </div>
            <div className="p-3 rounded-xl bg-medora-seafoam/20 border border-medora-seafoam/40">
              <span className="font-bold text-medora-dark block">Upcoming: 8:00 PM</span>
              Evening blood pressure & Lisinopril administration.
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
