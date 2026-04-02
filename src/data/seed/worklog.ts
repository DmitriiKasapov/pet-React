import { WorklogEntry } from '../../models'

// Current week: 2026-03-30 (Mon) to 2026-04-05 (Sun)
// Previous week: 2026-03-23 (Mon) to 2026-03-29 (Sun)
export const seedWorklog: WorklogEntry[] = [
  // Current week
  { id: 'wl-1',  taskId: 'task-3',  date: '2026-03-30', startHour: 9,  durationHours: 3,   comment: 'Set up DnD context and droppable columns' },
  { id: 'wl-2',  taskId: 'task-2',  date: '2026-03-30', startHour: 13, durationHours: 2,   comment: 'Fixed localStorage sync in worklogStore' },
  { id: 'wl-3',  taskId: 'task-7',  date: '2026-03-31', startHour: 10, durationHours: 2.5, comment: 'Shipping address form with validation' },
  { id: 'wl-4',  taskId: 'task-3',  date: '2026-03-31', startHour: 14, durationHours: 2,   comment: 'Drag overlay and visual feedback' },
  { id: 'wl-5',  taskId: 'task-10', date: '2026-04-01', startHour: 9,  durationHours: 3,   comment: 'Login screen and JWT token storage' },
  { id: 'wl-6',  taskId: 'task-7',  date: '2026-04-01', startHour: 13, durationHours: 1.5, comment: 'Payment details step' },
  { id: 'wl-7',  taskId: 'task-4',  date: '2026-04-02', startHour: 9,  durationHours: 2,   comment: 'Analytics service — getWeekAnalytics()' },
  { id: 'wl-8',  taskId: 'task-4',  date: '2026-04-02', startHour: 14, durationHours: 1.5, comment: 'Days summary with progress bars' },
  { id: 'wl-9',  taskId: 'task-10', date: '2026-04-03', startHour: 10, durationHours: 2,   comment: 'Register screen and forgot password flow' },
  { id: 'wl-10', taskId: 'task-3',  date: '2026-04-04', startHour: 9,  durationHours: 2.5, comment: 'Board worklog form with task search' },
  // Previous week
  { id: 'wl-11', taskId: 'task-1',  date: '2026-03-23', startHour: 9,  durationHours: 3,   comment: 'Vite + React + TS setup, Tailwind v4' },
  { id: 'wl-12', taskId: 'task-5',  date: '2026-03-24', startHour: 10, durationHours: 4,   comment: 'Product catalog layout and filter sidebar' },
  { id: 'wl-13', taskId: 'task-6',  date: '2026-03-25', startHour: 9,  durationHours: 3,   comment: 'Cart state and quantity controls' },
  { id: 'wl-14', taskId: 'task-9',  date: '2026-03-26', startHour: 11, durationHours: 2.5, comment: 'React Navigation setup and tab structure' },
  { id: 'wl-15', taskId: 'task-2',  date: '2026-03-27', startHour: 9,  durationHours: 3,   comment: 'Zustand stores initial implementation' },
]
