import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// Mock Firebase service so unit tests run deterministically offline
vi.mock('../services/firebase', () => ({
  isFirebaseConfigured: false,
  missingFirebaseKeys: [],
  app: null,
  auth: null,
  db: null
}))

// Mock AuthContext so MedicationProvider receives an authenticated user context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user-123' },
    userProfile: { role: 'elderly' },
    userRole: 'elderly',
    loading: false
  })
}))

import { MedicationProvider, useMedications } from '../context/MedicationContext'
import MedicationModal from '../components/medications/MedicationModal'

// Test consumer component to exercise MedicationContext
function MedicationConsumer() {
  const context = useMedications()
  return (
    <div>
      <div data-testid="med-count">{context.medications.length}</div>
      <ul data-testid="med-list">
        {context.medications.map((m) => (
          <li key={m.id} data-testid={`med-${m.id}`}>
            <span data-testid={`name-${m.id}`}>{m.name}</span>
            <span data-testid={`dosage-${m.id}`}>{m.dosage}</span>
            <span data-testid={`status-${m.id}`}>{m.status}</span>
            <span data-testid={`remaining-${m.id}`}>{m.remaining}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          context.addMedication({
            name: 'Atorvastatin Test',
            dosage: '40 mg',
            frequency: 'Once daily',
            reminderTime: '10:00 PM',
            remaining: 3,
            instructions: 'Take at bedtime',
            pill: 'White oval tablet'
          })
        }
      >
        Add Low Stock
      </button>
      <button
        onClick={() =>
          context.addMedication({
            name: 'Vitamin D3',
            dosage: '1000 IU',
            frequency: 'Once daily',
            reminderTime: '09:00 AM',
            remaining: 60,
            instructions: 'Take with water',
            pill: 'Yellow softgel'
          })
        }
      >
        Add Normal Stock
      </button>
      <button
        onClick={() =>
          context.updateMedication('med-1', {
            name: 'Metformin Updated',
            dosage: '1000 mg',
            frequency: 'Twice daily',
            reminderTime: '08:00 AM',
            remaining: 20
          })
        }
      >
        Update Med-1
      </button>
      <button onClick={() => context.deleteMedication('med-1')}>
        Delete Med-1
      </button>
    </div>
  )
}

describe('Medication Management Logic & Context', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads initial default medications when local storage is empty', () => {
    render(
      <MedicationProvider>
        <MedicationConsumer />
      </MedicationProvider>
    )

    expect(screen.getByTestId('med-count').textContent).toBe('3')
    expect(screen.getByTestId('name-med-1').textContent).toBe('Metformin')
    expect(screen.getByTestId('name-med-2').textContent).toBe('Lisinopril')
    expect(screen.getByTestId('name-med-3').textContent).toBe('Atorvastatin')
  })

  it('correctly sets status to "Low stock - Refill soon" when remaining <= 5', async () => {
    render(
      <MedicationProvider>
        <MedicationConsumer />
      </MedicationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Add Low Stock'))
    })

    expect(screen.getByTestId('med-count').textContent).toBe('4')
    expect(screen.getByText('Atorvastatin Test')).toBeInTheDocument()
    const list = screen.getByTestId('med-list')
    expect(list.textContent).toContain('Low stock - Refill soon')
  })

  it('correctly sets status to "Normal stock" when remaining > 5', async () => {
    render(
      <MedicationProvider>
        <MedicationConsumer />
      </MedicationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Add Normal Stock'))
    })

    expect(screen.getByTestId('med-count').textContent).toBe('4')
    expect(screen.getByText('Vitamin D3')).toBeInTheDocument()
    const list = screen.getByTestId('med-list')
    expect(list.textContent).toContain('Normal stock')
  })

  it('updates an existing medication in state without duplication', async () => {
    render(
      <MedicationProvider>
        <MedicationConsumer />
      </MedicationProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Update Med-1'))
    })

    expect(screen.getByTestId('med-count').textContent).toBe('3')
    expect(screen.getByTestId('name-med-1').textContent).toBe('Metformin Updated')
    expect(screen.getByTestId('dosage-med-1').textContent).toBe('1000 mg')
  })

  it('deletes a medication by ID and removes it from the list', async () => {
    render(
      <MedicationProvider>
        <MedicationConsumer />
      </MedicationProvider>
    )

    expect(screen.getByTestId('med-count').textContent).toBe('3')

    await act(async () => {
      fireEvent.click(screen.getByText('Delete Med-1'))
    })

    expect(screen.getByTestId('med-count').textContent).toBe('2')
    expect(screen.queryByTestId('name-med-1')).not.toBeInTheDocument()
  })
})

describe('MedicationModal Component Form Validation', () => {
  it('validates required fields and displays validation error when name is empty', async () => {
    const handleSave = vi.fn()
    const handleClose = vi.fn()

    const { container } = render(
      <MedicationModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        medication={null}
      />
    )

    const form = container.querySelector('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    // Should display validation error and not call onSave
    expect(screen.getByText(/medication name is required/i)).toBeInTheDocument()
    expect(handleSave).not.toHaveBeenCalled()
  })

  it('populates form with medication data when editing and submits updated values', async () => {
    const handleSave = vi.fn().mockResolvedValue({})
    const handleClose = vi.fn()

    const existingMed = {
      id: 'med-99',
      name: 'Amlodipine',
      dosage: '5 mg',
      frequency: 'Once daily in the morning',
      reminderTime: '08:00 AM',
      pill: 'White round tablet',
      instructions: 'Take with breakfast',
      remaining: 15
    }

    const { container } = render(
      <MedicationModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        medication={existingMed}
      />
    )

    // Inputs should be pre-populated
    const nameInput = screen.getByPlaceholderText(/e\.g\. Metformin/i)
    expect(nameInput.value).toBe('Amlodipine')

    const dosageInput = screen.getByPlaceholderText(/e\.g\. 500 mg/i)
    expect(dosageInput.value).toBe('5 mg')

    // Change dosage
    fireEvent.change(dosageInput, { target: { value: '10 mg' } })
    expect(dosageInput.value).toBe('10 mg')

    // Submit form
    const form = container.querySelector('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Amlodipine',
        dosage: '10 mg',
        frequency: 'Once daily in the morning',
        reminderTime: '08:00 AM'
      }),
      'med-99'
    )
    expect(handleClose).toHaveBeenCalled()
  })
})
