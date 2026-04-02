export type TaskStatus = 'planning' | 'progress' | 'done'

export interface Project {
  id: string
  name: string
  code: string
  color: string
  description: string
  createdAt: string
}

export interface Task {
  id: string
  projectId: string
  code: string
  title: string
  status: TaskStatus
  description: string
  estimateHours: number
  createdAt: string
}

export interface WorklogEntry {
  id: string
  taskId: string
  date: string        // YYYY-MM-DD
  startHour: number   // 0-23
  durationHours: number
  comment: string
}

export interface TaskComment {
  id: string
  taskId: string
  text: string
  createdAt: string
}
