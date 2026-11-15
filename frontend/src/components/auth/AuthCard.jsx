import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Info
} from 'lucide-react'

export default function AuthCard({ onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [role, setRole] = useState('elderly') // 'elderly' | 'family' | 'caretaker'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [clientError, setClientError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  const {
    registerUser,
    loginUser,
    error: authError,
    setError: setAuthError,
    isConfigured,
    missingFirebaseKeys
  } = useAuth()

  const roles = [
    {
      id: 'elderly',
      title: 'Elderly Person',
      desc: 'Managing my own medication & daily care',
      icon: HeartHandshake
    },
    {
      id: 'family',
      title: 'Family Member',
      desc: 'Staying connected & monitoring my relative',
      icon: Users
    },
    {
      id: 'caretaker',
      title: 'Caretaker',
      desc: 'Professional or designated daily care support',
      icon: ShieldCheck
    }
  ]

  const validate = () => {
    setClientError(null)
    setAuthError(null)

    if (mode === 'register') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setClientError('Please enter your full name (at least 2 characters).')
        return false
      }
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setClientError('Please enter a valid email address.')
      return false
    }

    if (!password || password.length < 6) {
      setClientError('Password must be at least 6 characters long.')
      return false
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setClientError('Passwords do not match. Please re-enter.')
        return false
      }
      if (!['elderly', 'family', 'caretaker'].includes(role)) {
        setClientError('Please select a valid user role.')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSuccessMessage(null)

    try {
      let authenticatedRole = null
      if (mode === 'register') {
        const result = await registerUser({
          email,
          password,
          fullName,
          role
        })
        authenticatedRole = result?.role || role
        setSuccessMessage('Registration successful! Redirecting to your dashboard...')
      } else {
        const result = await loginUser({
          email,
          password
        })
        authenticatedRole = result?.role
        setSuccessMessage('Welcome back! Redirecting to your dashboard...')
      }

      const validRoles = ['elderly', 'family', 'caretaker']
      if (onAuthSuccess && validRoles.includes(authenticatedRole)) {
        setTimeout(() => {
          onAuthSuccess(authenticatedRole)
        }, 600)
      }
    } catch (err) {
      // Auth error handled by AuthContext
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-medora-seafoam/60 p-6 sm:p-10 shadow-sm space-y-6">

      {/* Brand Header */}
      <div className="text-center space-y-3">
        <img
          src="/medora-logo.jpg"
          alt="Medora - Care. Always."
          className="w-24 h-24 mx-auto object-contain rounded-2xl shadow-xs border border-medora-seafoam/40 bg-white p-1"
        />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-medora-dark tracking-tight">
          {mode === 'login' ? 'Sign In to Medora' : 'Create Your Medora Account'}
        </h2>
        <p className="text-sm text-medora-dark/70">
          {mode === 'login'
            ? 'Access your role-based dashboard and care network'
            : 'Select your role and begin personalized healthcare management'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-medora-seafoam/30 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setClientError(null)
            setAuthError(null)
          }}
          className={`py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-medora-deep text-white shadow-xs'
              : 'text-medora-dark hover:bg-white/60'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setClientError(null)
            setAuthError(null)
          }}
          className={`py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-medora-deep text-white shadow-xs'
              : 'text-medora-dark hover:bg-white/60'
          }`}
        >
          Register New Account
        </button>
      </div>

      {/* Configuration Status Notice (if Firebase keys not yet set) */}
      {!isConfigured && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Firebase Configuration Needed</span>
          </div>
          <p className="leading-relaxed">
            Form validation, role assignment, and security rules are fully implemented. To connect live authentication, please add your real Firebase API keys to <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">frontend/.env</code>.
          </p>
        </div>
      )}

      {/* Error & Success Messages */}
      {(clientError || authError) && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{clientError || authError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* Role Selection (Registration Only) */}
        {mode === 'register' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-medora-deep">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((r) => {
                const IconComponent = r.icon
                const isSelected = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-medora-aqua bg-medora-seafoam/25 shadow-xs'
                        : 'border-medora-seafoam/70 bg-white hover:bg-medora-light'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-medora-deep text-white' : 'bg-medora-seafoam/40 text-medora-deep'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-medora-aqua" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-medora-dark leading-tight">{r.title}</div>
                      <div className="text-[11px] text-medora-dark/70 leading-snug mt-1">{r.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Full Name (Registration Only) */}
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold text-medora-dark mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-medora-dark/50" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Eleanor Miller"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>
          </div>
        )}

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-medora-dark mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-medora-dark/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-medora-dark mb-1.5">
            Password {mode === 'register' && '(minimum 6 characters)'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-medora-dark/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
              required
            />
          </div>
        </div>

        {/* Confirm Password (Registration Only) */}
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold text-medora-dark mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-medora-dark/50" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-medora-seafoam/80 bg-medora-light text-medora-dark text-sm focus:outline-medora-aqua transition-colors"
                required
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-medora-deep hover:bg-medora-dark text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <span>
            {submitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to Your Dashboard'
              : `Register as ${roles.find((r) => r.id === role)?.title || 'User'}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

    </div>
  )
}
