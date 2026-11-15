import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AccessibilityProvider } from '../context/AccessibilityContext'
import AccessibilityToolbar from '../components/accessibility/AccessibilityToolbar'

describe('Accessibility Controls & Context', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-font-size')
    document.documentElement.classList.remove('high-contrast')
  })

  it('renders default state as Normal font size and normal contrast', () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>
    )

    expect(screen.getByText(/Font: Normal/i)).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-font-size')).toBe('normal')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false)
  })

  it('steps font size through normal -> large -> extra-large and enforces maximum limit', () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>
    )

    const increaseBtn = screen.getByTitle('Increase text size')
    const decreaseBtn = screen.getByTitle('Decrease text size')

    // Initially A- is disabled at normal
    expect(decreaseBtn).toBeDisabled()

    // Step 1: Normal -> Large
    fireEvent.click(increaseBtn)
    expect(screen.getByText(/Font: Large/i)).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-font-size')).toBe('large')
    expect(decreaseBtn).not.toBeDisabled()

    // Step 2: Large -> Extra Large
    fireEvent.click(increaseBtn)
    expect(screen.getByText(/Font: Extra Large/i)).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-font-size')).toBe('extra-large')

    // At Extra Large, A+ button should be disabled
    expect(increaseBtn).toBeDisabled()
  })

  it('steps font size down with A- button and resets with Reset button', () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>
    )

    const increaseBtn = screen.getByTitle('Increase text size')
    const decreaseBtn = screen.getByTitle('Decrease text size')
    const resetBtn = screen.getByTitle('Reset text size')

    // Go to extra-large
    fireEvent.click(increaseBtn)
    fireEvent.click(increaseBtn)
    expect(screen.getByText(/Font: Extra Large/i)).toBeInTheDocument()

    // Step down to large
    fireEvent.click(decreaseBtn)
    expect(screen.getByText(/Font: Large/i)).toBeInTheDocument()

    // Reset back to normal
    fireEvent.click(resetBtn)
    expect(screen.getByText(/Font: Normal/i)).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-font-size')).toBe('normal')
  })

  it('toggles High Contrast mode on and off', () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>
    )

    const contrastBtn = screen.getByRole('button', { name: /toggle high contrast/i })
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false)

    // Toggle ON
    fireEvent.click(contrastBtn)
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
    expect(screen.getByText(/High Contrast Active/i)).toBeInTheDocument()

    // Toggle OFF
    fireEvent.click(contrastBtn)
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false)
  })
})
