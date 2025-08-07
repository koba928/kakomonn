'use client'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { UserProvider } from '@/contexts/UserContext'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </UserProvider>
  )
}