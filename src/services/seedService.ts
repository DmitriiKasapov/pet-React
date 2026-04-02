import { storageService } from './storageService'
import { seedProjects } from '../data/seed/projects'
import { seedTasks } from '../data/seed/tasks'
import { seedWorklog } from '../data/seed/worklog'
import { seedComments } from '../data/seed/comments'

const SEED_FLAG = 'app-seeded'

export const seedService = {
  initialize(): void {
    if (storageService.hasItem(SEED_FLAG)) return

    storageService.setItem('projects', seedProjects)
    storageService.setItem('tasks', seedTasks)
    storageService.setItem('worklog', seedWorklog)
    storageService.setItem('comments', seedComments)
    storageService.setItem(SEED_FLAG, true)
  },
}
