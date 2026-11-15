import { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  Users,
  Pill,
  AlertCircle,
  Phone,
  CheckCircle2,
  Volume2,
  ChevronRight,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  UserCheck,
  HeartHandshake,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { useMedications } from './context/MedicationContext'
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar'
import AuthCard from './components/auth/AuthCard'
import RoleGate from './components/auth/RoleGate'
import ElderlyDashboard from './components/dashboards/ElderlyDashboard'
import FamilyDashboard from './components/dashboards/FamilyDashboard'
import CaretakerDashboard from './components/dashboards/CaretakerDashboard'
import MedicationModal from './components/medications/MedicationModal'
import DeleteConfirmModal from './components/medications/DeleteConfirmModal'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { currentUser, userProfile, userRole, logoutUser } = useAuth()
  const { medications, addMedication, updateMedication, deleteMedication } = useMedications()

  // Modal states for Medication Add/Edit and Delete
  const [medModalOpen, setMedModalOpen] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingMed, setDeletingMed] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Medication action handlers
  const handleOpenAddMed = () => {
    setEditingMed(null)
    setMedModalOpen(true)
  }

  const handleOpenEditMed = (med) => {
    setEditingMed(med)
    setMedModalOpen(true)
  }

  const handleSaveMed = async (formData, id) => {
    if (id) {
      await updateMedication(id, formData)
    } else {
      await addMedication(formData)
    }
  }

  const handleOpenDeleteMed = (med) => {
    setDeletingMed(med)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDeleteMed = async () => {
    if (!deletingMed) return
    setIsDeleting(true)
    try {
      await deleteMedication(deletingMed.id)
      setDeleteConfirmOpen(false)
      setDeletingMed(null)
    } finally {
      setIsDeleting(false)
    }
  }

  // Automatically redirect away from auth tab when user profile is loaded
  useEffect(() => {
    const validRoles = ['elderly', 'family', 'caretaker']
    if (currentUser && userRole && validRoles.includes(userRole) && activeTab === 'auth') {
      setActiveTab(userRole)
    }
  }, [currentUser, userRole, activeTab])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'elderly', label: 'Elderly Dashboard' },
    { id: 'family', label: 'Family Portal' },
    { id: 'caretaker', label: 'Caretaker Station' },
    { id: 'meds', label: 'Medications' },
    { id: 'appointments', label: 'Appointments' }
  ]

  const roleLabels = {
    elderly: 'Elderly Person',
    family: 'Family Member',
    caretaker: 'Caretaker'
  }

  const handleLogout = async () => {
    await logoutUser()
    setActiveTab('home')
  }

  return (
    <div className="min-h-screen bg-medora-light text-medora-dark flex flex-col font-sans overflow-x-hidden">

      {/* 1. Accessible Font Scaling & High Contrast Toolbar */}
      <AccessibilityToolbar />

      {/* 2. Top Navigation Bar with Official Medora Logo Preserved */}
      <header className="bg-white border-b border-medora-seafoam/60 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Official Medora Brand Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setActiveTab('home')}
            title="Medora - Return to Home"
          >
            {/* Desktop / Tablet: Full Horizontal Logo with Symbol, Typography & 'Care. Always.' Tagline */}
            <div className="hidden sm:flex items-center">
              <img
                src="/medora-horizontal.png"
                alt="Medora - Care. Always."
                className="h-14 w-auto object-contain transition-opacity hover:opacity-95"
              />
            </div>

            {/* Mobile: Symbol-Only Version & Brand Typography */}
            <div className="flex sm:hidden items-center gap-2.5">
              <img
                src="/medora-symbol.png"
                alt="Medora Symbol"
                className="h-11 w-11 object-contain rounded-xl p-0.5 border border-medora-seafoam/50 bg-white shadow-2xs"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-medora-deep leading-tight">Medora</span>
                <span className="text-[10px] font-semibold text-medora-aqua tracking-wider uppercase">Care. Always.</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1 bg-medora-seafoam/30 rounded-xl">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-medora-deep text-white shadow-xs'
                    : 'text-medora-dark hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User Status & Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-medora-seafoam/25 border border-medora-seafoam/60 px-3 py-1.5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-medora-deep text-white flex items-center justify-center font-bold text-xs">
                  {userProfile?.fullName ? userProfile.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-medora-dark block leading-none">
                    {userProfile?.fullName || currentUser.email}
                  </span>
                  <span className="text-[10px] font-semibold text-medora-deep">
                    {roleLabels[userRole] || 'User'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="ml-1 p-1 rounded-lg text-medora-dark/60 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('auth')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'auth'
                    ? 'bg-medora-dark text-white'
                    : 'bg-medora-deep hover:bg-medora-dark text-white shadow-xs'
                }`}
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex xl:hidden p-2.5 rounded-xl text-medora-deep bg-medora-seafoam/30 hover:bg-medora-seafoam/50 border border-medora-seafoam/50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-medora-seafoam/40 px-4 py-4 shadow-lg animate-in fade-in duration-150">
            <div className="flex flex-col space-y-2">
              {navItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between min-h-[48px] cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-medora-deep text-white shadow-xs'
                      : 'text-medora-dark hover:bg-medora-seafoam/25'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <CheckCircle2 className="w-5 h-5 text-medora-seafoam" />
                  )}
                </button>
              ))}

              <div className="pt-2 border-t border-medora-seafoam/40">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 min-h-[48px] cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out ({userProfile?.fullName || currentUser.email})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('auth')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-center px-4 py-3.5 rounded-xl text-base font-bold bg-medora-deep text-white shadow-sm min-h-[48px] cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ======================================================== */}
        {/* 1. LANDING PAGE VIEW                                     */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Medora Landing Page Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-white border border-medora-seafoam/60 shadow-sm p-6 sm:p-10 lg:p-12">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-medora-seafoam/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-medora-mist/40 blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* Left Column: Heading, Supporting Text, Description, Buttons, Highlights */}
                <div className="lg:col-span-7 space-y-6">

                  {/* Small Label */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medora-seafoam/40 border border-medora-seafoam text-medora-deep text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-medora-aqua" />
                    <span>YOUR HEALTH, OUR CARE</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-medora-dark leading-[1.18]">
                    Better Care, Closer Connections.
                  </h1>

                  {/* Supporting Text */}
                  <p className="text-lg sm:text-xl font-semibold text-medora-deep leading-snug">
                    A little help every day. Greater peace of mind for everyone.
                  </p>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-medora-dark/80 leading-relaxed max-w-xl">
                    Manage medications, stay connected with caregivers and keep track of everyday healthcare — all in one place.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab(currentUser ? (userRole || 'elderly') : 'auth')}
                      className="px-8 py-4 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{currentUser ? 'Go to My Dashboard' : 'Get Started'}</span>
                      <ChevronRight className="w-5 h-5 text-medora-seafoam" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('elderly')}
                      className="px-8 py-4 rounded-xl border-2 border-medora-aqua/40 text-medora-deep hover:bg-medora-seafoam/25 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                    >
                      <span>Learn More</span>
                    </button>
                  </div>

                  {/* Three Concise Highlights */}
                  <div className="pt-6 border-t border-medora-seafoam/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-medora-light border border-medora-seafoam/30">
                      <div className="w-8 h-8 rounded-lg bg-medora-aqua/15 text-medora-deep flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4 text-medora-aqua" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-medora-dark">Medication Reminders</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-medora-light border border-medora-seafoam/30">
                      <div className="w-8 h-8 rounded-lg bg-medora-aqua/15 text-medora-deep flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-medora-aqua" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-medora-dark">Family Connection</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-medora-light border border-medora-seafoam/30">
                      <div className="w-8 h-8 rounded-lg bg-medora-aqua/15 text-medora-deep flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-medora-aqua" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-medora-dark">Care Management</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Warm, Realistic Photograph */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">

                    {/* Soft background decorative gradient accent */}
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-medora-seafoam/80 via-medora-mist/60 to-medora-aqua/30 blur-md -z-10" />

                    {/* Realistic Photograph Container */}
                    <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-medora-seafoam/20">
                      <img
                        src="/hero-elderly-care.jpg"
                        alt="Warm realistic photograph of an elderly Indian grandmother with a caring family caregiver at home"
                        className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover object-center transition-transform duration-500 hover:scale-102"
                      />
                    </div>

                    {/* Floating Reassuring Care Badge */}
                    <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white/95 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl shadow-lg border border-medora-seafoam/60 flex items-center gap-3 max-w-[240px]">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-medora-dark">Peace of Mind</p>
                        <p className="text-[11px] text-medora-dark/70 font-medium">Daily caregiver alerts & checks</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* Quick Portal Switcher Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-medora-seafoam/60 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-medora-dark">Explore Role-Based Portals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('elderly')}
                  className="p-5 rounded-2xl border border-medora-seafoam/80 hover:border-medora-aqua bg-medora-light hover:bg-white text-left transition-all cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-medora-deep text-white flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-medora-dark">Elderly Person</h4>
                  <p className="text-xs text-medora-dark/70">Simplified view, large tap targets, and one-touch emergency SOS.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('family')}
                  className="p-5 rounded-2xl border border-medora-seafoam/80 hover:border-medora-aqua bg-medora-light hover:bg-white text-left transition-all cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-medora-aqua text-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-medora-dark">Family Member</h4>
                  <p className="text-xs text-medora-dark/70">Remote peace of mind, daily adherence logs, and instant alert notifications.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('caretaker')}
                  className="p-5 rounded-2xl border border-medora-seafoam/80 hover:border-medora-aqua bg-medora-light hover:bg-white text-left transition-all cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-medora-dark text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-medora-dark">Caretaker Station</h4>
                  <p className="text-xs text-medora-dark/70">Patient care rosters, administration checks, and shift management.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PROTECTED ELDERLY PERSON DASHBOARD                     */}
        {/* ======================================================== */}
        {activeTab === 'elderly' && (
          <RoleGate allowedRoles={['elderly']} onNavigate={setActiveTab}>
            <ElderlyDashboard onLogout={() => setActiveTab('home')} />
          </RoleGate>
        )}

        {/* ======================================================== */}
        {/* 3. PROTECTED FAMILY MEMBER PORTAL                         */}
        {/* ======================================================== */}
        {activeTab === 'family' && (
          <RoleGate allowedRoles={['family']} onNavigate={setActiveTab}>
            <FamilyDashboard onLogout={() => setActiveTab('home')} />
          </RoleGate>
        )}

        {/* ======================================================== */}
        {/* 4. PROTECTED CARETAKER STATION                            */}
        {/* ======================================================== */}
        {activeTab === 'caretaker' && (
          <RoleGate allowedRoles={['caretaker']} onNavigate={setActiveTab}>
            <CaretakerDashboard onLogout={() => setActiveTab('home')} />
          </RoleGate>
        )}

        {/* ======================================================== */}
        {/* 5. AUTHENTICATION (LOGIN / REGISTRATION) VIEW             */}
        {/* ======================================================== */}
        {activeTab === 'auth' && (
          <AuthCard
            onAuthSuccess={(authenticatedRole) => {
              const validRoles = ['elderly', 'family', 'caretaker']
              const targetRole = authenticatedRole || userRole
              if (validRoles.includes(targetRole)) {
                setActiveTab(targetRole)
              }
            }}
          />
        )}

        {/* ======================================================== */}
        {/* 6. MEDICATIONS CATALOG                                    */}
        {/* ======================================================== */}
        {activeTab === 'meds' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-medora-seafoam/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-medora-aqua">Prescription Catalog</span>
                <h2 className="text-2xl font-bold text-medora-dark">Active Medications</h2>
                <p className="text-sm text-medora-dark/70">
                  Manage prescriptions, dosage frequencies, and pill inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddMed}
                className="px-5 py-2.5 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {medications.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-medora-seafoam text-medora-dark/70 space-y-3">
                <Pill className="w-12 h-12 mx-auto text-medora-aqua opacity-60" />
                <h3 className="text-lg font-bold text-medora-dark">No Medications Found</h3>
                <p className="text-sm">Add your active prescriptions to track dosage, schedules, and stock.</p>
                <button
                  type="button"
                  onClick={handleOpenAddMed}
                  className="px-5 py-2.5 rounded-xl bg-medora-deep text-white font-bold text-xs hover:bg-medora-dark transition-colors cursor-pointer"
                >
                  + Add Medication
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white rounded-2xl p-6 border border-medora-seafoam/50 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-medora-seafoam/40 text-medora-deep flex items-center justify-center">
                          <Pill className="w-6 h-6" />
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            Number(med.remaining) <= 5
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-medora-seafoam/40 text-medora-dark'
                          }`}
                        >
                          {med.status || (Number(med.remaining) <= 5 ? 'Low stock - Refill soon' : 'Normal stock')}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-medora-dark">{med.name}</h4>
                        <p className="text-sm font-semibold text-medora-aqua">{med.dosage}</p>
                        <p className="text-xs text-medora-dark/70 mt-1">{med.frequency}</p>
                        {med.reminderTime && (
                          <p className="text-xs font-semibold text-medora-deep mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Reminder: {med.reminderTime}</span>
                          </p>
                        )}
                      </div>

                      <div className="bg-medora-light rounded-xl p-3 text-xs space-y-1.5 border border-medora-seafoam/30">
                        <div className="flex justify-between text-medora-dark/80">
                          <span>Visual Guide:</span>
                          <span className="font-medium text-medora-dark">{med.pill || 'Standard tablet'}</span>
                        </div>
                        <div className="flex justify-between text-medora-dark/80">
                          <span>Remaining pills:</span>
                          <span className="font-bold text-medora-deep">{med.remaining} pills</span>
                        </div>
                        {med.instructions && (
                          <div className="pt-1 border-t border-medora-seafoam/30 text-medora-dark/70 italic text-[11px]">
                            {med.instructions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions: Edit & Delete */}
                    <div className="flex items-center gap-2 pt-3 border-t border-medora-seafoam/40">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMed(med)}
                        aria-label={`Edit ${med.name}`}
                        className="flex-1 py-2 px-3 rounded-xl border border-medora-seafoam/80 bg-white hover:bg-medora-seafoam/25 text-medora-dark font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-medora-deep" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDeleteMed(med)}
                        aria-label={`Delete ${med.name}`}
                        className="py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. DOCTOR APPOINTMENTS (PREVIEW)                          */}
        {/* ======================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-medora-seafoam/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-medora-aqua">Healthcare Calendar</span>
                <h2 className="text-2xl font-bold text-medora-dark">Doctor Appointments</h2>
                <p className="text-sm text-medora-dark/70">Scheduled physician check-ups and medical visits.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-medora-aqua shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-medora-aqua text-white">
                    Next Upcoming Visit
                  </span>
                  <span className="text-xs font-semibold text-medora-deep">In 3 days</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-medora-seafoam/40 text-medora-deep flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-medora-dark">Dr. Sarah Jenkins, MD</h4>
                    <p className="text-sm font-medium text-medora-aqua">Cardiology Consultation</p>
                    <p className="text-xs text-medora-dark/70 mt-1">St. Jude Medical Center, Suite 402</p>
                  </div>
                </div>

                <div className="bg-medora-seafoam/20 p-3 rounded-xl text-xs space-y-1 text-medora-dark/80 border border-medora-seafoam/40">
                  <div className="font-semibold text-medora-dark">Preparation Notes:</div>
                  <p>Bring recent blood pressure logs and current medication list.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Medication Add/Edit Modal */}
      <MedicationModal
        isOpen={medModalOpen}
        onClose={() => {
          setMedModalOpen(false)
          setEditingMed(null)
        }}
        onSave={handleSaveMed}
        medication={editingMed}
      />

      {/* Medication Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setDeletingMed(null)
        }}
        onConfirm={handleConfirmDeleteMed}
        medicationName={deletingMed?.name || ''}
        loading={isDeleting}
      />

      {/* Footer with Medora Symbol and Tagline */}
      <footer className="bg-white border-t border-medora-seafoam/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-medora-dark/70">
          <div className="flex items-center gap-2.5">
            <img
              src="/medora-symbol.png"
              alt="Medora Symbol"
              className="w-6 h-6 object-contain"
            />
            <span className="font-bold text-medora-deep text-sm">Medora</span>
            <span className="text-medora-dark/40">•</span>
            <span className="font-medium text-medora-aqua">Care. Always.</span>
          </div>
          <div>
            Elderly Care & Medication Management Platform • Hackathon Foundation Ready
          </div>
        </div>
      </footer>
    </div>
  )
}
