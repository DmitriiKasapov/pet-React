import { WorklogEntry, Task, Project, TaskStatus } from '../models'
import { formatDate, addDays } from '../utils/boardUtils'

export interface DayAnalytics {
  date: string
  label: string
  hours: number
}

export interface ProjectAnalytics {
  projectId: string
  name: string
  color: string
  hours: number
}

export interface TaskAnalytics {
  taskId: string
  code: string
  title: string
  projectName: string
  status: TaskStatus
  hours: number
}

export interface WeekAnalytics {
  totalHours: number
  entryCount: number
  days: DayAnalytics[]
  projects: ProjectAnalytics[]
  tasks: TaskAnalytics[]
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getWeekAnalytics(
  weekStart: Date,
  entries: WorklogEntry[],
  tasks: Task[],
  projects: Project[],
): WeekAnalytics {
  // Build date strings for each day of the week
  const days: DayAnalytics[] = Array.from({ length: 7 }, (_, i) => ({
    date: formatDate(addDays(weekStart, i)),
    label: DAY_NAMES[i],
    hours: 0,
  }))

  const taskMap = new Map(tasks.map((t) => [t.id, t]))
  const projectMap = new Map(projects.map((p) => [p.id, p]))

  const daySet = new Set(days.map((d) => d.date))
  const weekEntries = entries.filter((e) => daySet.has(e.date))

  let totalHours = 0
  const projectHours = new Map<string, number>()
  const taskHours = new Map<string, number>()

  for (const entry of weekEntries) {
    totalHours += entry.durationHours

    // Day hours
    const day = days.find((d) => d.date === entry.date)
    if (day) day.hours += entry.durationHours

    // Task/Project hours
    const task = taskMap.get(entry.taskId)
    if (task) {
      taskHours.set(task.id, (taskHours.get(task.id) ?? 0) + entry.durationHours)
      projectHours.set(task.projectId, (projectHours.get(task.projectId) ?? 0) + entry.durationHours)
    }
  }

  const projectsList: ProjectAnalytics[] = Array.from(projectHours.entries())
    .map(([projectId, hours]) => {
      const project = projectMap.get(projectId)
      return {
        projectId,
        name: project?.name ?? 'Unknown',
        color: project?.color ?? '#ccc',
        hours,
      }
    })
    .sort((a, b) => b.hours - a.hours)

  const tasksList: TaskAnalytics[] = Array.from(taskHours.entries())
    .map(([taskId, hours]) => {
      const task = taskMap.get(taskId)
      const project = task ? projectMap.get(task.projectId) : undefined
      return {
        taskId,
        code: task?.code ?? '',
        title: task?.title ?? 'Unknown',
        projectName: project?.name ?? 'Unknown',
        status: task?.status ?? 'planning',
        hours,
      }
    })
    .sort((a, b) => b.hours - a.hours)

  return {
    totalHours,
    entryCount: weekEntries.length,
    days,
    projects: projectsList,
    tasks: tasksList,
  }
}
