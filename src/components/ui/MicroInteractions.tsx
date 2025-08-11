'use client'

import React from 'react'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = React.memo(function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) {
  const baseStyles = 'relative overflow-hidden transition-all duration-300 ease-out transform'
  const hoverStyles = 'hover:scale-105 hover:shadow-lg active:scale-95'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'
  }
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm rounded-md min-h-[44px]',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg min-h-[44px] sm:min-h-[48px]',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl min-h-[48px] sm:min-h-[56px]'
  }
  
  return (
    <button
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        touch-manipulation select-none
        group
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      type="button"
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
    </button>
  )
})

interface FloatingActionButtonProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  style?: React.CSSProperties
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = React.memo(function FloatingActionButton({
  onClick,
  children,
  className = '',
  'aria-label': ariaLabel,
  style
}) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed right-6 z-50
        bg-gradient-to-r from-indigo-500 to-purple-600
        hover:from-indigo-600 hover:to-purple-700
        text-white p-4 rounded-full shadow-lg
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-indigo-500/50
        touch-manipulation
        ${className}
      `}
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 24px)', ...(style || {}) }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
})