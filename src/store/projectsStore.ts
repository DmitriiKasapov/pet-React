import { create } from 'zustand'
import { Project } from '../models'
import { storageService } from '../services/storageService'
import { useTasksStore } from './tasksStore'
import { useWorklogStore } from './worklogStore'
import { useCommentsStore } from './commentsStore'

const STORAGE_KEY = 'projects'

interface ProjectsState {
  projects: Project[]
  loadProjects: () => void
  getById: (id: string) => Project | undefined
  createProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],

  loadProjects() {
    const data = storageService.getItem<Project[]>(STORAGE_KEY) ?? []
    set({ projects: data })
  },

  getById(id) {
    return get().projects.find((p) => p.id === id)
  },

  createProject(project) {
    const updated = [...get().projects, project]
    storageService.setItem(STORAGE_KEY, updated)
    set({ projects: updated })
  },

  updateProject(project) {
    const updated = get().projects.map((p) => (p.id === project.id ? project : p))
    storageService.setItem(STORAGE_KEY, updated)
    set({ projects: updated })
  },

  deleteProject(id) {
    const updated = get().projects.filter((p) => p.id !== id)
    storageService.setItem(STORAGE_KEY, updated)
    set({ projects: updated })

    // Cascade: remove tasks, their worklog entries and comments in one pass each
    const taskIdSet = new Set(
      useTasksStore.getState().tasks.filter((t) => t.projectId === id).map((t) => t.id)
    )

    const remainingEntries = useWorklogStore.getState().entries.filter((e) => !taskIdSet.has(e.taskId))
    storageService.setItem('worklog', remainingEntries)
    useWorklogStore.setState({ entries: remainingEntries })

    const remainingComments = useCommentsStore.getState().comments.filter((c) => !taskIdSet.has(c.taskId))
    storageService.setItem('comments', remainingComments)
    useCommentsStore.setState({ comments: remainingComments })

    const remainingTasks = useTasksStore.getState().tasks.filter((t) => !taskIdSet.has(t.id))
    storageService.setItem('tasks', remainingTasks)
    useTasksStore.setState({ tasks: remainingTasks })
  },
}))
