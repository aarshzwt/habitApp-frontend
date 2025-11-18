'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils'
import { DropdownProps } from './types'

export function Dropdown({ triggerLabel, items }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all shadow-sm',
          open
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-500'
        )}
      >
        {triggerLabel}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-max min-w-[180px] rounded-xl bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick?.()
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all',
                item.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
