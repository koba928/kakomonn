'use client'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { UserProvider } from '@/contexts/UserContext'
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
        maxVisible={3}
      />
    </>
  )
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ThemeProvider>
          <GlobalErrorHandler>
            {children}
          </GlobalErrorHandler>
        </ThemeProvider>
      </UserProvider>
    </ErrorBoundary>
  )
}