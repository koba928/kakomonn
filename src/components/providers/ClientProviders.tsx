'use client'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AuthProvider } from './AuthProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ErrorNotificationContainer } from '@/components/ui/ErrorNotification'
import { useErrorHandler } from '@/hooks/useErrorHandler'

interface ClientProvidersProps {
  children: React.ReactNode
}

function GlobalErrorHandler({ children }: { children: React.ReactNode }) {
  const errorHandler = useErrorHandler()

  return (
    <>
      {children}
      <ErrorNotificationContainer
        errors={errorHandler.error}
        onDismiss={errorHandler.clearErrors}
      />
    </>
  )
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <GlobalErrorHandler>
            {children}
          </GlobalErrorHandler>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}