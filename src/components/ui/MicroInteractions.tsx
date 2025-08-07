'use client'

import React, { useState, useEffect } from 'react'
import { StarIcon, HeartIcon } from '../icons/IconSystem'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const baseStyles = 'relative overflow-hidden transition-all duration-300 ease-out transform'
  const hoverStyles = 'hover:scale-105 hover:shadow-lg active:scale-95'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  }
  
  return (
    <button
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
    </button>
  )
}

interface LikeButtonProps {
  initialLikes?: number
  isLiked?: boolean
  onToggle?: (liked: boolean) => void
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  initialLikes = 0,
  isLiked = false,
  onToggle
}) => {
  const [liked, setLiked] = useState(isLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleClick = () => {
    setIsAnimating(true)
    const newLiked = !liked
    setLiked(newLiked)
    setLikes(prev => newLiked ? prev + 1 : prev - 1)
    onToggle?.(newLiked)
    
    setTimeout(() => setIsAnimating(false), 300)
  }
  
  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
        ${liked 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      <HeartIcon 
        size={16} 
        className={`transition-all duration-300 ${
          liked ? 'fill-red-500 text-red-500' : ''
        } ${isAnimating ? 'animate-pulse' : ''}`}
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  )
}

interface RatingProps {
  rating: number
  maxRating?: number
  onRate?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export const InteractiveRating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  onRate,
  readonly = false,
  size = 20
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  
  const currentRating = isHovering ? hoverRating : rating
  
  return (
    <div 
      className="flex gap-1"
      onMouseLeave={() => {
        setIsHovering(false)
        setHoverRating(0)
      }}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= currentRating
        
        return (
          <button
            key={index}
            className={`transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            onMouseEnter={() => {
              if (!readonly) {
                setIsHovering(true)
                setHoverRating(starValue)
              }
            }}
            onClick={() => {
              if (!readonly && onRate) {
                onRate(starValue)
              }
            }}
            disabled={readonly}
          >
            <StarIcon
              size={size}
              filled={isFilled}
              color={isFilled ? '#fbbf24' : '#d1d5db'}
              className={`transition-colors duration-200 ${
                !readonly && 'hover:text-yellow-400'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

interface FloatingActionButtonProps {
  onClick?: () => void
  icon: React.ReactNode
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  position = 'bottom-right',
  className = ''
}) => {
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }
  
  return (
    <button
      onClick={onClick}
      className={`
        fixed z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
        text-white rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:scale-110 active:scale-95
        flex items-center justify-center
        ${positionStyles[position]}
        ${className}
      `}
    >
      {icon}
    </button>
  )
}

interface ProgressBarProps {
  progress: number
  maxProgress?: number
  color?: string
  className?: string
  animated?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  maxProgress = 100,
  color = 'bg-blue-500',
  className = '',
  animated = true
}) => {
  const percentage = Math.min((progress / maxProgress) * 100, 100)
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`
          h-full rounded-full transition-all duration-500 ease-out
          ${color}
          ${animated ? 'animate-pulse' : ''}
        `}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

interface PulseLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const PulseLoading: React.FC<PulseLoadingProps> = ({
  size = 'md',
  color = 'bg-blue-500',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            ${sizeStyles[size]} ${color} rounded-full animate-pulse
          `}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  )
}

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 
            rounded-md whitespace-nowrap transition-opacity duration-200
            ${positionStyles[position]}
            ${className}
          `}
        >
          {content}
        </div>
      )}
    </div>
  )
}