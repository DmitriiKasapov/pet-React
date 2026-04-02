const PREFIX = 'devlog:'

export const storageService = {
  getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  removeItem(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  hasItem(key: string): boolean {
    return localStorage.getItem(PREFIX + key) !== null
  },
}
