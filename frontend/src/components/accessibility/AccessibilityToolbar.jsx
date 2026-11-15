import { useAccessibility } from '../../context/AccessibilityContext'
import { ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react'

export default function AccessibilityToolbar() {
  const {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast
  } = useAccessibility()

  const fontSizeLabels = {
    normal: 'Normal',
    large: 'Large (+12%)',
    'extra-large': 'Extra Large (+25%)'
  }

  return (
    <aside
      aria-label="Accessibility Controls"
      className="bg-white/95 backdrop-blur-sm border-b border-medora-seafoam/60 px-4 py-2 text-xs text-medora-dark transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

        {/* Label & Current Status */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-medora-deep uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-medora-aqua" />
            <span>Accessibility:</span>
          </span>
          <span className="bg-medora-seafoam/35 px-2 py-0.5 rounded-md font-semibold text-medora-dark">
            Font: {fontSizeLabels[fontSize]}
          </span>
          {highContrast && (
            <span className="bg-medora-dark text-white px-2 py-0.5 rounded-md font-bold">
              High Contrast Active
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Decrease Font */}
          <button
            type="button"
            onClick={decreaseFontSize}
            disabled={fontSize === 'normal'}
            aria-label="Decrease text size"
            title="Decrease text size"
            className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-medora-seafoam/70 bg-white hover:bg-medora-seafoam/20 disabled:opacity-40 disabled:cursor-not-allowed text-medora-dark font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-medora-deep" />
            <span>A-</span>
          </button>

          {/* Increase Font */}
          <button
            type="button"
            onClick={increaseFontSize}
            disabled={fontSize === 'extra-large'}
            aria-label="Increase text size"
            title="Increase text size"
            className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-medora-seafoam/70 bg-white hover:bg-medora-seafoam/20 disabled:opacity-40 disabled:cursor-not-allowed text-medora-dark font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-medora-deep" />
            <span>A+</span>
          </button>

          {/* Reset Font */}
          <button
            type="button"
            onClick={resetFontSize}
            disabled={fontSize === 'normal'}
            aria-label="Reset text size to default"
            title="Reset text size"
            className="min-h-[38px] px-2 py-1.5 rounded-lg border border-medora-seafoam/70 bg-white hover:bg-medora-seafoam/20 disabled:opacity-40 disabled:cursor-not-allowed text-medora-dark font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-medora-deep" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <span className="h-4 w-px bg-medora-seafoam/60 mx-1" aria-hidden="true" />

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            aria-label="Toggle high contrast mode"
            className={`min-h-[38px] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              highContrast
                ? 'bg-medora-dark text-white shadow-xs'
                : 'border border-medora-seafoam/80 bg-white text-medora-dark hover:bg-medora-seafoam/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>
        </div>

      </div>
    </aside>
  )
}
