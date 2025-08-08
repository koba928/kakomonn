'use client'

import { useState, useCallback } from 'react'

interface ErrorHandler {
  error: string | null
  isLoading: boolean
  handleValidationError: (message: string, field?: string) => void
  handleSubmissionError: (error: Error | string) => void
  clearErrors: () => void
  withLoading: <T>(operation: () => Promise<T>, errorMessage?: string) => Promise<T | null>
}

export function useFormErrorHandler(): ErrorHandler {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleValidationError = useCallback((message: string, field?: string) => {
    setError(field ? `${field}: ${message}` : message)
  }, [])

  const handleSubmissionError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : error
    setError(message)
  }, [])

  const clearErrors = useCallback(() => {
    setError(null)
  }, [])

  const withLoading = useCallback(async <T,>(
    operation: () => Promise<T>,
    errorMessage: string = 'エラーが発生しました'
  ): Promise<T | null> => {
    setIsLoading(true)
    clearErrors()
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      handleSubmissionError(err instanceof Error ? err : errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleSubmissionError, clearErrors])

  return {
    error,
    isLoading,
    handleValidationError,
    handleSubmissionError,
    clearErrors,
    withLoading
  }
}

export function useFileUploadErrorHandler(): ErrorHandler {
  return useFormErrorHandler()
}

export function useErrorHandler(): ErrorHandler {
  return useFormErrorHandler()
}