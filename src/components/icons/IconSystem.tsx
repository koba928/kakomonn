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

export const SearchIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={ariaLabel && !ariaHidden ? 'img' : undefined}
  >
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
))

export const UploadIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
))

export const ThreadIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
))

export const BookIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z"/>
    <path d="M12 4s1.5 2 5 2 5-2 5-2v14s-1.5 1-5 1-5-1-5-1V4z"/>
  </svg>
))

export const UserIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
))

export const HeartIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
))

interface StarIconProps extends IconProps {
  filled?: boolean
}

export const StarIcon: React.FC<StarIconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  filled = false,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? color : 'none'}
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
))

export const ArrowRightIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
))

export const ChevronDownIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <polyline points="6,9 12,15 18,9"/>
  </svg>
))

export const MenuIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
))

export const CloseIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
))

export const ExternalLinkIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
))

export const PlusIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
))

export const CheckIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
))

export const XMarkIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
))

export const MagnifyingGlassIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
))

export const BuildingOfficeIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M3 21h18"/>
    <path d="M5 21V7l8-4v18"/>
    <path d="M19 21V11l-6-4"/>
    <path d="M9 9v.01"/>
    <path d="M9 12v.01"/>
    <path d="M9 15v.01"/>
    <path d="M9 18v.01"/>
  </svg>
))

export const AcademicCapIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
))

export const ClockIcon: React.FC<IconProps> = React.memo(({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  strokeWidth = 2,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden
}) => (
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
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
))