import { useEffect } from 'react'
import { useProjectsStore } from '../store/projectsStore'
import { useTasksStore } from '../store/tasksStore'
import { useWorklogStore } from '../store/worklogStore'
import { useCommentsStore } from '../store/commentsStore'

/**
 * Initializes all Zustand stores from localStorage.
 * Call once per page that needs access to app data.
 */
export function useStoreInit() {
  const loadProjects = useProjectsStore((s) => s.loadProjects)
  const loadTasks = useTasksStore((s) => s.loadTasks)
  const loadEntries = useWorklogStore((s) => s.loadEntries)
  const loadComments = useCommentsStore((s) => s.loadComments)

  useEffect(() => {
    loadProjects()
    loadTasks()
    loadEntries()
    loadComments()
  }, [loadProjects, loadTasks, loadEntries, loadComments])
}
