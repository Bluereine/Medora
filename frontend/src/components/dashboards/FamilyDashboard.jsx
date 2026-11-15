import { useAuth } from '../../context/AuthContext'
import {
  Users,
  CheckCircle2,
  Clock,
  Phone,
  AlertCircle,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

export default function FamilyDashboard({ onLogout }) {
  const { userProfile, currentUser, logoutUser } = useAuth()
  const displayName = userProfile?.fullName || currentUser?.displayName || 'Family Member'

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
            <Users className="w-4 h-4 text-medora-aqua" />
            <span>Family Member Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-medora-dark tracking-tight">
            Welcome, {displayName}!
          </h1>
          <p className="text-base text-medora-dark/70">
            Real-time connection, reassurance, and medication adherence monitoring for your loved ones.
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
            <span className="font-bold">Authorized Role:</span> Family Member • <span className="font-mono text-medora-deep">{userProfile?.email || currentUser?.email}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          Active Session
        </span>
      </div>

      {/* Linked Elderly Family Member Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-medora-seafoam/50 text-medora-deep font-bold text-lg flex items-center justify-center">
                EM
              </div>
              <div>
                <h3 className="text-lg font-bold text-medora-dark">Eleanor Miller (Mother)</h3>
                <span className="text-xs text-medora-dark/70">Age 76 • Home Care</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              95% Adherence
            </span>
          </div>

          <div className="bg-medora-seafoam/25 rounded-2xl p-4 space-y-2 border border-medora-seafoam/40 text-xs">
            <span className="font-bold uppercase tracking-wider text-medora-deep block">Today's Dose Status</span>
            <div className="flex justify-between items-center py-1 border-b border-medora-seafoam/30">
              <span>Morning: Metformin (500mg)</span>
              <span className="font-bold text-emerald-700">Taken (8:05 AM)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Evening: Lisinopril (10mg)</span>
              <span className="font-bold text-amber-700">Scheduled for 8:00 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-medora-deep" />
            <h3 className="text-lg font-bold text-medora-dark">Caregiver Alerts & Peace of Mind</h3>
          </div>
          <p className="text-sm text-medora-dark/70">
            Medora will automatically notify you by email whenever a dose is missed or a prescription reaches low stock.
          </p>
          <div className="p-4 rounded-2xl bg-medora-light border border-medora-seafoam/50 text-xs text-medora-dark/80">
            ✓ Automated missed-dose alerts active for Eleanor Miller.
          </div>
        </div>
      </div>

    </div>
  )
}
