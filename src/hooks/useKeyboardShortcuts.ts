// src/hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react'

interface KeyboardShortcuts {
  onSave?: () => void
  onSubmit?: () => void
  onExport?: () => void
  onReset?: () => void
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const { onSave, onSubmit, onExport, onReset } = shortcuts

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S pour sauvegarder
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        onSave?.()
      }

      // Ctrl/Cmd + Enter pour soumettre
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        onSubmit?.()
      }

      // Ctrl/Cmd + P pour exporter PDF
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault()
        onExport?.()
      }

      // Ctrl/Cmd + Shift + R pour reset (avec confirmation)
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && event.shiftKey) {
        event.preventDefault()
        if (window.confirm('Are you sure you want to reset the form? This will clear all data.')) {
          onReset?.()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSave, onSubmit, onExport, onReset])

  return {
    shortcuts: [
      { key: 'Ctrl+S', description: 'Save draft' },
      { key: 'Ctrl+Enter', description: 'Submit application' },
      { key: 'Ctrl+P', description: 'Export PDF' },
      { key: 'Ctrl+Shift+R', description: 'Reset form' }
    ]
  }
}