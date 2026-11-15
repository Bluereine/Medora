import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoleGate from '../components/auth/RoleGate'

// Mock the AuthContext hook with the exact relative path from src/tests
const mockUseAuth = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

describe('RoleGate Authorization & Role-Based Access Control', () => {
  it('displays loading spinner while authentication state is being verified', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      userRole: null,
      loading: true,
      isConfigured: true,
      missingFirebaseKeys: []
    })

    render(
      <RoleGate allowedRoles={['elderly']}>
        <div data-testid="protected-content">Secret Patient Data</div>
      </RoleGate>
    )

    expect(screen.getByText(/Verifying Session/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('blocks unauthenticated access and prompts for sign-in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      userRole: null,
      loading: false,
      isConfigured: true,
      missingFirebaseKeys: []
    })

    render(
      <RoleGate allowedRoles={['elderly']}>
        <div data-testid="protected-content">Secret Patient Data</div>
      </RoleGate>
    )

    expect(screen.getByText(/Sign-in Required/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('blocks unauthorized roles and displays Restricted Access barrier with redirect action', () => {
    const handleNavigate = vi.fn()
    mockUseAuth.mockReturnValue({
      currentUser: { uid: 'user-family-123', email: 'family@test.com' },
      userProfile: { fullName: 'Jane Doe', role: 'family' },
      userRole: 'family',
      loading: false,
      isConfigured: true,
      missingFirebaseKeys: []
    })

    render(
      <RoleGate allowedRoles={['elderly']} onNavigate={handleNavigate}>
        <div data-testid="protected-content">Elderly Dashboard Content</div>
      </RoleGate>
    )

    expect(screen.getByText(/Restricted Dashboard Access/i)).toBeInTheDocument()
    expect(screen.getByText(/Your account is currently registered as/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()

    // Clicking redirect button navigates to user's authorized role dashboard
    const redirectBtn = screen.getByRole('button', { name: /go to my authorized dashboard/i })
    fireEvent.click(redirectBtn)
    expect(handleNavigate).toHaveBeenCalledWith('family')
  })

  it('grants access and renders children when authenticated user has an allowed role', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: 'user-elderly-123', email: 'senior@test.com' },
      userProfile: { fullName: 'Robert Smith', role: 'elderly' },
      userRole: 'elderly',
      loading: false,
      isConfigured: true,
      missingFirebaseKeys: []
    })

    render(
      <RoleGate allowedRoles={['elderly']}>
        <div data-testid="protected-content">Elderly Dashboard Content</div>
      </RoleGate>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByText(/Restricted Dashboard Access/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Sign-in Required/i)).not.toBeInTheDocument()
  })
})
