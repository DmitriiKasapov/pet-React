import { create } from 'zustand'
import { Task, TaskStatus } from '../models'
import { storageService } from '../services/storageService'

const STORAGE_KEY = 'tasks'

interface TasksState {
  tasks: Task[]
  loadTasks: () => void
  getById: (id: string) => Task | undefined
  getByProject: (projectId: string) => Task[]
  createTask: (task: Task) => void
  updateTask: (task: Task) => void
  updateStatus: (id: string, status: TaskStatus) => void
  deleteTask: (id: string) => void
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],

  loadTasks() {
    const data = storageService.getItem<Task[]>(STORAGE_KEY) ?? []
    set({ tasks: data })
  },

  getById(id) {
    return get().tasks.find((t) => t.id === id)
  },

  getByProject(projectId) {
    return get().tasks.filter((t) => t.projectId === projectId)
  },

  createTask(task) {
    const updated = [...get().tasks, task]
    storageService.setItem(STORAGE_KEY, updated)
    set({ tasks: updated })
  },

  updateTask(task) {
    const updated = get().tasks.map((t) => (t.id === task.id ? task : t))
    storageService.setItem(STORAGE_KEY, updated)
    set({ tasks: updated })
  },

  updateStatus(id, status) {
    const updated = get().tasks.map((t) => (t.id === id ? { ...t, status } : t))
    storageService.setItem(STORAGE_KEY, updated)
    set({ tasks: updated })
  },

  deleteTask(id) {
    const updated = get().tasks.filter((t) => t.id !== id)
    storageService.setItem(STORAGE_KEY, updated)
    set({ tasks: updated })
  },
}))
