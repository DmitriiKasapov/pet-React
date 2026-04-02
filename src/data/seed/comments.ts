import { TaskComment } from '../../models'

export const seedComments: TaskComment[] = [
  {
    id: 'cmt-1',
    taskId: 'task-3',
    text: 'Need to handle touch events for mobile drag support.',
    createdAt: '2026-03-31T15:00:00.000Z',
  },
  {
    id: 'cmt-2',
    taskId: 'task-3',
    text: 'DragOverlay works great — smooth visual when dragging across days.',
    createdAt: '2026-04-01T10:30:00.000Z',
  },
  {
    id: 'cmt-3',
    taskId: 'task-7',
    text: 'Stripe Elements should simplify PCI compliance for the payment step.',
    createdAt: '2026-03-31T16:00:00.000Z',
  },
  {
    id: 'cmt-4',
    taskId: 'task-10',
    text: 'Using expo-secure-store for token storage — safer than AsyncStorage.',
    createdAt: '2026-04-01T11:00:00.000Z',
  },
  {
    id: 'cmt-5',
    taskId: 'task-4',
    text: 'Consider adding a chart library later — recharts or visx.',
    createdAt: '2026-04-02T14:00:00.000Z',
  },
]
