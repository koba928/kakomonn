export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  set: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  getObject: <T>(key: string): T | null => {
    const item = storage.get(key)
    if (!item) return null
    try {
      return JSON.parse(item)
    } catch {
      return null
    }
  },

  setObject: <T>(key: string, value: T): boolean => {
    try {
      return storage.set(key, JSON.stringify(value))
    } catch {
      return false
    }
  }
}

export function setItemDebounced(key: string, value: string, delay = 300): void {
  if (typeof window === 'undefined') return
  
  const timeoutKey = `debounce_${key}`
  const existingTimeout = (window as any)[timeoutKey]
  
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }
  
  (window as any)[timeoutKey] = setTimeout(() => {
    storage.set(key, value)
    delete (window as any)[timeoutKey]
  }, delay)
}