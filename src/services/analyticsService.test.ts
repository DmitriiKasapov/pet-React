import { describe, it, expect } from 'vitest'
import { getWeekAnalytics } from './analyticsService'
import type { WorklogEntry, Task, Project } from '../models'

const monday = new Date('2024-04-01') // Monday

const projects: Project[] = [
  { id: 'p1', name: 'DevLog', code: 'DL', color: '#3b5bdb', description: '', createdAt: '' },
  { id: 'p2', name: 'E-Commerce', code: 'EC', color: '#2f9e44', description: '', createdAt: '' },
]

const tasks: Task[] = [
  { id: 't1', projectId: 'p1', code: 'DL-001', title: 'Setup', status: 'done', description: '', estimateHours: 4, createdAt: '' },
  { id: 't2', projectId: 'p2', code: 'EC-001', title: 'Auth', status: 'progress', description: '', estimateHours: 8, createdAt: '' },
]

describe('getWeekAnalytics', () => {
  it('returns zero totals when no entries', () => {
    const result = getWeekAnalytics(monday, [], tasks, projects)
    expect(result.totalHours).toBe(0)
    expect(result.entryCount).toBe(0)
    expect(result.days).toHaveLength(7)
    expect(result.days.every((d) => d.hours === 0)).toBe(true)
    expect(result.projects).toHaveLength(0)
    expect(result.tasks).toHaveLength(0)
  })

  it('sums hours for entries within the week', () => {
    const entries: WorklogEntry[] = [
      { id: 'e1', taskId: 't1', date: '2024-04-01', startHour: 9, durationHours: 3, comment: '' },
      { id: 'e2', taskId: 't1', date: '2024-04-02', startHour: 10, durationHours: 2, comment: '' },
    ]
    const result = getWeekAnalytics(monday, entries, tasks, projects)
    expect(result.totalHours).toBe(5)
    expect(result.entryCount).toBe(2)
  })

  it('excludes entries outside the week', () => {
    const entries: WorklogEntry[] = [
      { id: 'e1', taskId: 't1', date: '2024-03-31', startHour: 9, durationHours: 5, comment: '' }, // Sunday before
      { id: 'e2', taskId: 't1', date: '2024-04-08', startHour: 9, durationHours: 5, comment: '' }, // Monday after
      { id: 'e3', taskId: 't1', date: '2024-04-03', startHour: 9, durationHours: 2, comment: '' }, // Wednesday in week
    ]
    const result = getWeekAnalytics(monday, entries, tasks, projects)
    expect(result.totalHours).toBe(2)
    expect(result.entryCount).toBe(1)
  })

  it('aggregates hours correctly per day', () => {
    const entries: WorklogEntry[] = [
      { id: 'e1', taskId: 't1', date: '2024-04-01', startHour: 9, durationHours: 4, comment: '' },
      { id: 'e2', taskId: 't1', date: '2024-04-01', startHour: 14, durationHours: 2, comment: '' },
      { id: 'e3', taskId: 't1', date: '2024-04-03', startHour: 9, durationHours: 3, comment: '' },
    ]
    const result = getWeekAnalytics(monday, entries, tasks, projects)
    expect(result.days[0].hours).toBe(6) // Monday
    expect(result.days[2].hours).toBe(3) // Wednesday
    expect(result.days[1].hours).toBe(0) // Tuesday
  })

  it('aggregates hours correctly per project', () => {
    const entries: WorklogEntry[] = [
      { id: 'e1', taskId: 't1', date: '2024-04-01', startHour: 9, durationHours: 3, comment: '' }, // p1
      { id: 'e2', taskId: 't2', date: '2024-04-02', startHour: 9, durationHours: 5, comment: '' }, // p2
    ]
    const result = getWeekAnalytics(monday, entries, tasks, projects)
    const p1 = result.projects.find((p) => p.projectId === 'p1')
    const p2 = result.projects.find((p) => p.projectId === 'p2')
    expect(p1?.hours).toBe(3)
    expect(p2?.hours).toBe(5)
  })

  it('sorts projects and tasks by hours descending', () => {
    const entries: WorklogEntry[] = [
      { id: 'e1', taskId: 't1', date: '2024-04-01', startHour: 9, durationHours: 2, comment: '' },
      { id: 'e2', taskId: 't2', date: '2024-04-02', startHour: 9, durationHours: 8, comment: '' },
    ]
    const result = getWeekAnalytics(monday, entries, tasks, projects)
    expect(result.projects[0].hours).toBeGreaterThanOrEqual(result.projects[1].hours)
    expect(result.tasks[0].hours).toBeGreaterThanOrEqual(result.tasks[1].hours)
  })
})
