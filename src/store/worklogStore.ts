import { create } from 'zustand'
import { WorklogEntry } from '../models'
import { storageService } from '../services/storageService'
import { formatDate, addDays } from '../utils/boardUtils'

const STORAGE_KEY = 'worklog'

// Returns YYYY-MM-DD dates for all 7 days of the week containing weekStart
function getWeekDates(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => formatDate(addDays(weekStart, i)))
}

interface WorklogState {
  entries: WorklogEntry[]
  loadEntries: () => void
  getByTask: (taskId: string) => WorklogEntry[]
  getByWeek: (weekStart: Date) => WorklogEntry[]
  createEntry: (entry: WorklogEntry) => void
  updateEntry: (entry: WorklogEntry) => void
  deleteEntry: (id: string) => void
}

export const useWorklogStore = create<WorklogState>((set, get) => ({
  entries: [],

  loadEntries() {
    const data = storageService.getItem<WorklogEntry[]>(STORAGE_KEY) ?? []
    set({ entries: data })
  },

  getByTask(taskId) {
    return get().entries.filter((e) => e.taskId === taskId)
  },

  getByWeek(weekStart) {
    const dates = new Set(getWeekDates(weekStart))
    return get().entries.filter((e) => dates.has(e.date))
  },

  createEntry(entry) {
    const updated = [...get().entries, entry]
    storageService.setItem(STORAGE_KEY, updated)
    set({ entries: updated })
  },

  updateEntry(entry) {
    const updated = get().entries.map((e) => (e.id === entry.id ? entry : e))
    storageService.setItem(STORAGE_KEY, updated)
    set({ entries: updated })
  },

  deleteEntry(id) {
    const updated = get().entries.filter((e) => e.id !== id)
    storageService.setItem(STORAGE_KEY, updated)
    set({ entries: updated })
  },
}))
