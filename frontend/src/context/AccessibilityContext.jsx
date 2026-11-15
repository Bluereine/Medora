import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext(null)

const STORAGE_KEY = 'medora_accessibility_prefs'

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.fontSize || 'normal'
      }
    } catch (e) {
      console.warn('Error reading accessibility prefs from storage:', e)
    }
    return 'normal'
  })

  const [highContrast, setHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return Boolean(parsed.highContrast)
      }
    } catch (e) {
      console.warn('Error reading accessibility prefs from storage:', e)
    }
    return false
  })

  // Apply to HTML element & save preferences
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontSize, highContrast })
      )
    } catch (e) {
      console.warn('Error saving accessibility prefs to storage:', e)
    }

    // Apply font size class/attribute to root element
    document.documentElement.setAttribute('data-font-size', fontSize)

    // Apply high contrast class to root element
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [fontSize, highContrast])

  const increaseFontSize = () => {
    setFontSize((current) => {
      if (current === 'normal') return 'large'
      if (current === 'large') return 'extra-large'
      return 'extra-large'
    })
  }

  const decreaseFontSize = () => {
    setFontSize((current) => {
      if (current === 'extra-large') return 'large'
      if (current === 'large') return 'normal'
      return 'normal'
    })
  }

  const resetFontSize = () => {
    setFontSize('normal')
  }

  const toggleHighContrast = () => {
    setHighContrast((current) => !current)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
