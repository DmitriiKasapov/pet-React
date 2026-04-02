import { Link } from 'react-router'
import { Task, WorklogEntry } from '../../../models'
import { Badge } from '../../../components/elements/Badge'

interface Props {
  task: Task
  entries: WorklogEntry[]
}

export function TaskCard({ task, entries }: Props) {
  const logged = entries
    .filter((e) => e.taskId === task.id)
    .reduce((sum, e) => sum + e.durationHours, 0)

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="project-detail-page__modules__task-card card flex items-center gap-4 px-4 py-3 hover:shadow-md transition-shadow"
    >
      <span className="text-xs font-mono text-text-muted flex-shrink-0 w-16">{task.code}</span>
      <p className="flex-1 text-sm font-medium text-text truncate">{task.title}</p>
      <Badge status={task.status} />
      <span className="hidden sm:block text-xs text-text-muted flex-shrink-0 w-20 text-right">
        {logged.toFixed(1)} / {task.estimateHours}h
      </span>
    </Link>
  )
}
