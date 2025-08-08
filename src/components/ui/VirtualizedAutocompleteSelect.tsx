'use client'

import React, { useState, useEffect, useMemo } from 'react'

interface Option {
  value: string
  label: string
}

interface VirtualizedAutocompleteSelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function VirtualizedAutocompleteSelect({
  options,
  value,
  onChange,
  placeholder = '選択してください',
  className = '',
  disabled = false
}: VirtualizedAutocompleteSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOptions = useMemo(() => {
    console.log('Options available:', options.length, 'Search query:', searchQuery)
    if (!searchQuery) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    if (isOpen && selectedOption) {
      setSearchQuery(selectedOption.label)
    }
  }, [isOpen, selectedOption])

  const handleSelect = (option: Option) => {
    onChange(option.value)
    setSearchQuery(option.label)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={isOpen ? searchQuery : selectedOption?.label || ''}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <button
              key={option.value}
              onMouseDown={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}