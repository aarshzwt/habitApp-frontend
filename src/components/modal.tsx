import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  footerClassName?: string
  children: React.ReactNode // Body content
  footer?: React.ReactNode // Footer content (buttons)
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = 'max-w-xl',
  footerClassName,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Close on Escape + Trap focus
  useEffect(() => {
    const modal = document.querySelector('.modal-container') as HTMLElement
    if (!isOpen || !modal) return

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = Array.from(
      modal.querySelectorAll<HTMLElement>(focusableSelectors)
    )
    const firstEl = focusableElements[0]
    const lastEl = focusableElements[focusableElements.length - 1]

    // Focus the first focusable element when modal opens
    firstEl?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && focusableElements.length > 0) {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // overlay click
    >
      <div
        className={`modal-container bg-white rounded-lg shadow-lg w-full relative transform transition-all scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        {title && (
          <div className="py-4 px-6 flex justify-between items-center border-b border-gray-300">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500 hover:text-primary-500 p-1"
            >
              <X />
            </Button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 ">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'py-4 px-6 flex justify-end gap-2 border-t border-gray-300',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
