import { useAuth } from '../../context/AuthContext'
import AuthCard from './AuthCard'
import { ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react'

export default function RoleGate({
  allowedRoles = [],
  children,
  onNavigate
}) {
  const { currentUser, userProfile, userRole, loading } = useAuth()

  // 1. Loading State while Firebase verifies session
  if (loading) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-medora-seafoam/60 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-medora-seafoam/30 flex items-center justify-center text-medora-deep">
          <RefreshCw className="w-8 h-8 animate-spin text-medora-aqua" />
        </div>
        <h3 className="text-xl font-bold text-medora-dark">Verifying Session</h3>
        <p className="text-xs text-medora-dark/70">
          Checking your secure Medora credentials...
        </p>
      </div>
    )
  }

  // 2. Unauthenticated State
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-medora-seafoam/25 border border-medora-seafoam/70 text-xs text-medora-dark flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-medora-deep shrink-0" />
          <span>
            <strong>Sign-in Required:</strong> Please sign in to access this protected healthcare area.
          </span>
        </div>
        <AuthCard
          onAuthSuccess={(authenticatedRole) => {
            const validRoles = ['elderly', 'family', 'caretaker']
            const targetRole = authenticatedRole || userRole
            if (onNavigate && validRoles.includes(targetRole)) {
              onNavigate(targetRole)
            }
          }}
        />
      </div>
    )
  }

  // 3. Unauthorized Role State
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const roleLabels = {
      elderly: 'Elderly Person',
      family: 'Family Member',
      caretaker: 'Caretaker'
    }

    return (
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-3xl border-2 border-amber-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-medora-dark">Restricted Dashboard Access</h2>
          <p className="text-sm text-medora-dark/75 leading-relaxed">
            Your account is currently registered as <strong className="text-medora-deep">{roleLabels[userRole] || userRole}</strong>. This dashboard is reserved for <strong className="text-medora-dark">{allowedRoles.map((r) => roleLabels[r] || r).join(', ')}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate(userRole)}
          className="w-full py-4 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Go to My Authorized Dashboard ({roleLabels[userRole] || userRole})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // 4. Authorized Access Granted
  return <>{children}</>
}
