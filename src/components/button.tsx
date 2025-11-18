'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'default'
  | 'glass'
  | 'ghost'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  fullWidth?: boolean
  href?: string
  outline?: boolean
  tooltip?: string
}

const baseStyles = `inline-flex items-center justify-center font-medium border border-transparent rounded transition-colors 
focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
duration-200 ease-in-out cursor-pointer`

const variantClasses: Record<Variant, { solid: string; outline: string }> = {
  default: {
    solid:
      'bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-500',
    outline:
      'border border-neutral-800 text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-500',
  },
  primary: {
    solid: 'bg-primary-500 text-white hover:bg-blue-600 focus:ring-blue-600',
    outline:
      'border border-primary-500 text-primary-500 hover:bg-blue-50 focus:ring-blue-600',
  },
  secondary: {
    solid: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300',
    outline:
      'border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  },
  destructive: {
    solid: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
  },
  ghost: {
    solid: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
  },
  glass: {
    solid:
      'bg-white/10 text-white backdrop-blur-md hover:bg-white/20 focus:ring-white/30 border border-white/10',
    outline:
      'bg-transparent border border-white/30 text-white hover:bg-white/10 focus:ring-white/30',
  },
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
  icon: 'p-2 rounded-full',
}

export const Button = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'sm',
      isLoading = false,
      fullWidth = false,
      disabled,
      href,
      outline = false,
      tooltip,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      baseStyles,
      outline ? variantClasses[variant].outline : variantClasses[variant].solid,
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
      'leading-4 relative'
    )

    const tooltipId = tooltip ? `tooltip-${Math.random().toString(36).substr(2, 9)}` : undefined

    const buttonContent = (
      <>
        {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        {children}
      </>
    )

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          data-tooltip-id={tooltipId}
        >
          {buttonContent}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={classes}
        data-tooltip-id={tooltipId}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'
