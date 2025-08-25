// Material Design 3 (Material You) Design System
export const materialTheme = {
  // Typography - Google's Roboto-inspired system
  typography: {
    displayLarge: 'text-5xl font-normal leading-tight tracking-tight',
    displayMedium: 'text-4xl font-normal leading-tight tracking-tight',
    displaySmall: 'text-3xl font-normal leading-tight',
    
    headlineLarge: 'text-3xl font-normal leading-tight',
    headlineMedium: 'text-2xl font-normal leading-tight',
    headlineSmall: 'text-xl font-normal leading-tight',
    
    titleLarge: 'text-xl font-medium leading-normal',
    titleMedium: 'text-base font-medium leading-normal tracking-wide',
    titleSmall: 'text-sm font-medium leading-normal tracking-wide',
    
    bodyLarge: 'text-base font-normal leading-relaxed',
    bodyMedium: 'text-sm font-normal leading-relaxed',
    bodySmall: 'text-xs font-normal leading-relaxed',
    
    labelLarge: 'text-sm font-medium leading-normal tracking-wide',
    labelMedium: 'text-xs font-medium leading-normal tracking-wide',
    labelSmall: 'text-xs font-medium leading-normal tracking-wider',
  },
  
  // Elevation (Material Design shadow system)
  elevation: {
    0: '',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
    5: 'shadow-xl',
  },
  
  // Border radius following Material Design 3
  radius: {
    none: 'rounded-none',
    xs: 'rounded',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  
  // Spacing system (4px grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // State layer opacity
  states: {
    hover: 'hover:bg-black/5 dark:hover:bg-white/5',
    focus: 'focus:bg-black/10 dark:focus:bg-white/10',
    pressed: 'active:bg-black/10 dark:active:bg-white/10',
    disabled: 'disabled:opacity-38',
  },
  
  // Material Design 3 color roles
  colors: {
    // Primary colors
    primary: 'bg-blue-600 text-white',
    primaryContainer: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    onPrimary: 'text-white',
    onPrimaryContainer: 'text-blue-900 dark:text-blue-100',
    
    // Secondary colors
    secondary: 'bg-indigo-600 text-white',
    secondaryContainer: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100',
    
    // Surface colors
    surface: 'bg-white dark:bg-gray-900',
    surfaceVariant: 'bg-gray-50 dark:bg-gray-800',
    onSurface: 'text-gray-900 dark:text-gray-100',
    onSurfaceVariant: 'text-gray-700 dark:text-gray-300',
    
    // Background
    background: 'bg-gray-50 dark:bg-gray-950',
    onBackground: 'text-gray-900 dark:text-gray-100',
    
    // Error colors
    error: 'bg-red-600 text-white',
    errorContainer: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
    
    // Outline
    outline: 'border-gray-300 dark:border-gray-700',
    outlineVariant: 'border-gray-200 dark:border-gray-800',
  },
  
  // Component styles
  components: {
    // Buttons following Material Design 3
    button: {
      filled: 'px-6 py-2.5 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200',
      outlined: 'px-6 py-2.5 rounded-full font-medium border hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200',
      text: 'px-4 py-2.5 rounded-lg font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200',
      elevated: 'px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200',
    },
    
    // Cards
    card: {
      filled: 'p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm',
      outlined: 'p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
      elevated: 'p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-200',
    },
    
    // Input fields
    input: {
      filled: 'px-4 py-3 rounded-t-lg border-b-2 bg-gray-100 dark:bg-gray-800 focus:border-blue-600 dark:focus:border-blue-400 transition-colors duration-200',
      outlined: 'px-4 py-3 rounded-lg border-2 focus:border-blue-600 dark:focus:border-blue-400 transition-colors duration-200',
    },
    
    // Chips
    chip: {
      base: 'px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5',
      filled: 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      outlined: 'border border-gray-300 dark:border-gray-700',
    },
  },
  
  // Animation durations
  animation: {
    fast: 'duration-150',
    medium: 'duration-300',
    slow: 'duration-500',
  },
}

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}