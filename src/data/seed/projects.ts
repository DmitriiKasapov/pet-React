import { Project } from '../../models'

export const seedProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'DevLog',
    code: 'DL',
    color: '#3b5bdb',
    description: 'Personal time tracking and worklog management application',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'proj-2',
    name: 'E-Commerce Platform',
    code: 'EC',
    color: '#2f9e44',
    description: 'Full-stack online store with product catalog and checkout',
    createdAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'proj-3',
    name: 'Mobile App',
    code: 'MA',
    color: '#e67700',
    description: 'Cross-platform mobile application built with React Native',
    createdAt: '2026-03-10T11:00:00.000Z',
  },
]
