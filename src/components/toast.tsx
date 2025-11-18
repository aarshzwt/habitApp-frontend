'use client'
import React, { useCallback } from 'react'
import {
  toast,
  ToastContainer as ReactToastifyContainer,
  Id,
} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

// ==================== TYPES ====================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastIconProps {
  type: ToastType
}

export interface ToastOptions {
  /** The type of toast to display */
  type?: ToastType
  /** Custom message to display */
  message: string
  /** Duration in milliseconds before auto-close (0 = no auto-close) */
  autoClose?: number | false
  /** Position of the toast on screen */
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
  /** Whether to show progress bar */
  hideProgressBar?: boolean
  /** Whether toast can be closed by clicking */
  closeOnClick?: boolean
  /** Whether toast can be dragged */
  draggable?: boolean
  /** Whether to pause on hover */
  pauseOnHover?: boolean
  /** Whether to pause when window loses focus */
  pauseOnFocusLoss?: boolean
  /** Custom className for styling */
  className?: string
  /** Whether to show newest toasts on top */
  newestOnTop?: boolean
  /** Custom icon component */
  icon?: React.ReactNode | false
}

export interface ToastContainerOptions {
  /** Default position for all toasts */
  position?: ToastOptions['position']
  /** Default auto-close duration */
  autoClose?: number | false
  /** Default progress bar visibility */
  hideProgressBar?: boolean
  /** Default newest on top setting */
  newestOnTop?: boolean
  /** Default close on click setting */
  closeOnClick?: boolean
  /** Default draggable setting */
  draggable?: boolean
  /** Default pause on hover setting */
  pauseOnHover?: boolean
  /** Default pause on focus loss setting */
  pauseOnFocusLoss?: boolean
  /** Limit number of toasts displayed */
  limit?: number
  /** Custom container className */
  className?: string
}

// ==================== CONFIGURATIONS ====================

/**
 * Default configuration for toast notifications
 */
const defaultToastConfig: Required<Omit<ToastOptions, 'message' | 'icon'>> = {
  type: 'info',
  autoClose: 4000,
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  className: '',
  newestOnTop: false,
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Show a toast notification
 * @param options - Configuration options for the toast
 * @returns Toast ID that can be used to update or dismiss the toast
 */
export const showToast = (options: ToastOptions): Id => {
  const config = { ...defaultToastConfig, ...options }

  const toastOptions = {
    autoClose: config.autoClose,
    position: config.position,
    hideProgressBar: config.hideProgressBar,
    closeOnClick: config.closeOnClick,
    draggable: config.draggable,
    pauseOnHover: config.pauseOnHover,
    pauseOnFocusLoss: config.pauseOnFocusLoss,
    className: config.className,
  }

  switch (config.type) {
    case 'success':
      return toast.success(config.message, toastOptions)
    case 'error':
      return toast.error(config.message, toastOptions)
    case 'warning':
      return toast.warn(config.message, toastOptions)
    case 'info':
    default:
      return toast.info(config.message, toastOptions)
  }
}

/**
 * Show a success toast
 * @param message - Success message to display
 * @param options - Additional options (optional)
 * @returns Toast ID
 */
export const showSuccessToast = (
  message: string,
  options?: Omit<ToastOptions, 'message' | 'type'>
): Id => {
  return showToast({ ...options, message, type: 'success' })
}

/**
 * Show an error toast
 * @param message - Error message to display
 * @param options - Additional options (optional)
 * @returns Toast ID
 */
export const showErrorToast = (
  message: string,
  options?: Omit<ToastOptions, 'message' | 'type'>
): Id => {
  return showToast({ ...options, message, type: 'error' })
}

/**
 * Show a warning toast
 * @param message - Warning message to display
 * @param options - Additional options (optional)
 * @returns Toast ID
 */
export const showWarningToast = (
  message: string,
  options?: Omit<ToastOptions, 'message' | 'type'>
): Id => {
  return showToast({ ...options, message, type: 'warning' })
}

/**
 * Show an info toast
 * @param message - Info message to display
 * @param options - Additional options (optional)
 * @returns Toast ID
 */
export const showInfoToast = (
  message: string,
  options?: Omit<ToastOptions, 'message' | 'type'>
): Id => {
  return showToast({ ...options, message, type: 'info' })
}

/**
 * Dismiss a specific toast by ID
 * @param toastId - ID of the toast to dismiss
 */
export const dismissToast = (toastId: Id): void => {
  toast.dismiss(toastId)
}

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = (): void => {
  toast.dismiss()
}

/**
 * Update an existing toast
 * @param toastId - ID of the toast to update
 * @param options - New options for the toast
 */
export const updateToast = (toastId: Id, options: ToastOptions): void => {
  toast.update(toastId, {
    render: options.message,
    type: options.type,
    autoClose: options.autoClose,
    hideProgressBar: options.hideProgressBar,
    closeOnClick: options.closeOnClick,
    draggable: options.draggable,
    pauseOnHover: options.pauseOnHover,
    pauseOnFocusLoss: options.pauseOnFocusLoss,
  })
}

/**
 * Check if a toast is currently active
 * @param toastId - ID of the toast to check
 * @returns Boolean indicating if toast is active
 */
export const isToastActive = (toastId: Id): boolean => {
  return toast.isActive(toastId)
}

// ==================== COMPONENTS ====================

/**
 * Icon component for toast notifications
 * @param type - Type of toast (success, error, warning, info)
 * @returns Appropriate icon for the toast type
 */
const ToastIcon: React.FC<ToastIconProps> = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-white" />
    case 'error':
      return <XCircle className="w-5 h-5 text-white" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-white" />
    case 'info':
    default:
      return <Info className="w-5 h-5 text-white" />
  }
}

/**
 * Get appropriate styling classes for toast type
 * @param type - Type of toast
 * @returns CSS classes for the toast type
 */
const getToastStyles = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white border-l-4 border-green-600'
    case 'error':
      return 'bg-red-500 text-white border-l-4 border-red-600'
    case 'warning':
      return 'bg-yellow-500 text-white border-l-4 border-yellow-600'
    case 'info':
    default:
      return 'bg-blue-500 text-white border-l-4 border-blue-600'
  }
}

/**
 * Props for the ToastContainer component
 */
interface ToastContainerProps extends ToastContainerOptions {
  /** Additional CSS classes */
  className?: string
}

/**
 * Custom toast container component with predefined styling and behavior
 * @param options - Configuration options for the toast container
 * @returns Configured ToastContainer component
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  autoClose = 4000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  draggable = true,
  pauseOnHover = true,
  pauseOnFocusLoss = true,
  limit = 5,
  className = '',
  ...props
}) => {
  return (
    <ReactToastifyContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={false}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      limit={limit}
      toastClassName={(context) =>
        `relative flex items-center gap-3 px-6 py-4 min-w-[320px] max-w-[420px]
         rounded-lg shadow-lg font-medium text-sm transition-all duration-300
         ${getToastStyles(context?.type as ToastType)} ${className}`
      }
      className="flex-1"
      icon={(context) => <ToastIcon type={context?.type as ToastType} />}
      progressClassName="bg-white/70 h-1 rounded-b-lg"
      {...props}
    />
  )
}

// ==================== CUSTOM HOOK ====================

/**
 * Custom hook for toast notifications
 * @returns Object with toast utility functions
 */
export const useToast = () => {
  const toastFn = useCallback((options: ToastOptions): Id => {
    return showToast(options)
  }, [])

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): Id => {
      return showSuccessToast(message, options)
    },
    []
  )

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): Id => {
      return showErrorToast(message, options)
    },
    []
  )

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): Id => {
      return showWarningToast(message, options)
    },
    []
  )

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): Id => {
      return showInfoToast(message, options)
    },
    []
  )

  const dismiss = useCallback((toastId?: Id): void => {
    if (toastId) {
      dismissToast(toastId)
    } else {
      dismissAllToasts()
    }
  }, [])

  const update = useCallback((toastId: Id, options: ToastOptions): void => {
    updateToast(toastId, options)
  }, [])

  const isActive = useCallback((toastId: Id): boolean => {
    return isToastActive(toastId)
  }, [])

  return {
    toast: toastFn,
    success,
    error,
    warning,
    info,
    dismiss,
    update,
    isActive,
  }
}

// ==================== EXPORTS ====================

export default ToastContainer
