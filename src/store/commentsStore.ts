import { create } from 'zustand'
import { TaskComment } from '../models'
import { storageService } from '../services/storageService'

const STORAGE_KEY = 'comments'

interface CommentsState {
  comments: TaskComment[]
  loadComments: () => void
  getByTask: (taskId: string) => TaskComment[]
  createComment: (comment: TaskComment) => void
  updateComment: (comment: TaskComment) => void
  deleteComment: (id: string) => void
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],

  loadComments() {
    const data = storageService.getItem<TaskComment[]>(STORAGE_KEY) ?? []
    set({ comments: data })
  },

  getByTask(taskId) {
    return get().comments.filter((c) => c.taskId === taskId)
  },

  createComment(comment) {
    const updated = [...get().comments, comment]
    storageService.setItem(STORAGE_KEY, updated)
    set({ comments: updated })
  },

  updateComment(comment) {
    const updated = get().comments.map((c) => (c.id === comment.id ? comment : c))
    storageService.setItem(STORAGE_KEY, updated)
    set({ comments: updated })
  },

  deleteComment(id) {
    const updated = get().comments.filter((c) => c.id !== id)
    storageService.setItem(STORAGE_KEY, updated)
    set({ comments: updated })
  },
}))
