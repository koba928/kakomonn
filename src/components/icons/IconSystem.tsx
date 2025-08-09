'use client'

import React from 'react'

export interface IconProps {
  size?: number | string
  color?: string
  className?: string
  strokeWidth?: number
  'aria-label'?: string
  'aria-hidden'?: boolean
}

export interface StarIconProps extends IconProps {
  filled?: boolean
}

export const SearchIcon: React.FC<IconProps> = React.memo(function SearchIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  )
})

export const HeartIcon: React.FC<IconProps> = React.memo(function HeartIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
})

export const StarIcon: React.FC<StarIconProps> = React.memo(function StarIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  filled = false,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? color : "none"} 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  )
})

export const ArrowRightIcon: React.FC<IconProps> = React.memo(function ArrowRightIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12,5 19,12 12,19"/>
    </svg>
  )
})

export const PlusIcon: React.FC<IconProps> = React.memo(function PlusIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
})

export const CheckIcon: React.FC<IconProps> = React.memo(function CheckIcon({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel && !ariaHidden ? 'img' : undefined}
    >
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  )
})