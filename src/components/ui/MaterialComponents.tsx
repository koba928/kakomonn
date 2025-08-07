'use client'

import React from 'react'
import { materialTheme, cn } from '@/styles/material-design'

// Material Design Button
interface MDButtonProps {
  children: React.ReactNode
  variant?: 'filled' | 'outlined' | 'text' | 'elevated'
  color?: 'primary' | 'secondary' | 'error'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  className?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const MDButton: React.FC<MDButtonProps> = ({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  startIcon,
  endIcon,
}) => {
  const baseStyles = materialTheme.components.button[variant]
  
  const colorStyles = {
    primary: variant === 'filled' 
      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
      : variant === 'outlined'
      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
      : 'text-blue-600 dark:text-blue-400',
    secondary: variant === 'filled'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
      : variant === 'outlined'
      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
      : 'text-indigo-600 dark:text-indigo-400',
    error: variant === 'filled'
      ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
      : variant === 'outlined'
      ? 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400'
      : 'text-red-600 dark:text-red-400',
  }
  
  const sizeStyles = {
    small: 'text-sm py-2 px-4',
    medium: 'text-base py-2.5 px-6',
    large: 'text-lg py-3 px-8',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        colorStyles[color],
        sizeStyles[size],
        'inline-flex items-center justify-center gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="w-5 h-5">{startIcon}</span>}
      {children}
      {endIcon && <span className="w-5 h-5">{endIcon}</span>}
    </button>
  )
}

// Material Design Card
interface MDCardProps {
  children: React.ReactNode
  variant?: 'filled' | 'outlined' | 'elevated'
  className?: string
  onClick?: () => void
}

export const MDCard: React.FC<MDCardProps> = ({
  children,
  variant = 'elevated',
  className = '',
  onClick,
}) => {
  const baseStyles = materialTheme.components.card[variant]
  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-lg' : ''
  
  return (
    <div
      className={cn(
        baseStyles,
        interactiveStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Material Design Surface
interface MDSurfaceProps {
  children: React.ReactNode
  elevation?: 0 | 1 | 2 | 3 | 4 | 5
  className?: string
}

export const MDSurface: React.FC<MDSurfaceProps> = ({
  children,
  elevation = 1,
  className = '',
}) => {
  return (
    <div
      className={cn(
        materialTheme.colors.surface,
        materialTheme.elevation[elevation],
        materialTheme.radius.md,
        'p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Material Design Chip
interface MDChipProps {
  label: string
  variant?: 'filled' | 'outlined'
  selected?: boolean
  onClick?: () => void
  onDelete?: () => void
  icon?: React.ReactNode
  className?: string
}

export const MDChip: React.FC<MDChipProps> = ({
  label,
  variant = 'filled',
  selected = false,
  onClick,
  onDelete,
  icon,
  className = '',
}) => {
  const baseStyles = materialTheme.components.chip.base
  const variantStyles = materialTheme.components.chip[variant]
  const selectedStyles = selected 
    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700' 
    : ''
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles,
        selectedStyles,
        onClick && 'cursor-pointer hover:shadow-md',
        'transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="ml-1 w-4 h-4 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
        >
          ×
        </button>
      )}
    </div>
  )
}

// Material Design FAB (Floating Action Button)
interface MDFABProps {
  icon: React.ReactNode
  onClick?: () => void
  extended?: boolean
  label?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const MDFAB: React.FC<MDFABProps> = ({
  icon,
  onClick,
  extended = false,
  label,
  size = 'medium',
  className = '',
}) => {
  const sizeStyles = {
    small: 'w-10 h-10',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
  }
  
  return (
    <button
      className={cn(
        'fixed bottom-4 right-4 z-50',
        extended ? 'px-4 py-3 rounded-2xl' : cn(sizeStyles[size], 'rounded-full'),
        'bg-blue-600 text-white shadow-lg hover:shadow-xl',
        'flex items-center justify-center gap-2',
        'transition-all duration-300 transform hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      <span className={extended ? 'w-5 h-5' : ''}>{icon}</span>
      {extended && label && <span className="font-medium">{label}</span>}
    </button>
  )
}

// Material Design Navigation Rail
interface MDNavigationRailProps {
  items: Array<{
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
  }>
  className?: string
}

export const MDNavigationRail: React.FC<MDNavigationRailProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav
      className={cn(
        'w-20 bg-white dark:bg-gray-900',
        'border-r border-gray-200 dark:border-gray-800',
        'flex flex-col items-center py-4 gap-2',
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={cn(
            'w-16 h-16 rounded-2xl',
            'flex flex-col items-center justify-center gap-1',
            'transition-all duration-200',
            item.active
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          )}
        >
          <span className="w-6 h-6">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

// Material Design App Bar
interface MDAppBarProps {
  title: string
  navigationIcon?: React.ReactNode
  actions?: React.ReactNode[]
  className?: string
}

export const MDAppBar: React.FC<MDAppBarProps> = ({
  title,
  navigationIcon,
  actions,
  className = '',
}) => {
  return (
    <header
      className={cn(
        'h-16 px-4',
        'bg-white dark:bg-gray-900',
        'border-b border-gray-200 dark:border-gray-800',
        'flex items-center gap-4',
        className
      )}
    >
      {navigationIcon && (
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800">
          {navigationIcon}
        </button>
      )}
      <h1 className={cn(materialTheme.typography.titleLarge, 'flex-1')}>
        {title}
      </h1>
      {actions && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}