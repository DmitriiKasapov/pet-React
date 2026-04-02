import { Task, WorklogEntry } from '../../../models'
import { Badge } from '../../../components/elements/Badge'
import { EmptyState } from '../../../components/elements/EmptyState'

interface Props {
  tasks: Task[]
  entries: WorklogEntry[]
}

export function ProjectAnalytics({ tasks, entries }: Props) {
  const taskStats = tasks
    .map((task) => {
      const hours = entries
        .filter((e) => e.taskId === task.id)
        .reduce((sum, e) => sum + e.durationHours, 0)
      return { task, hours }
    })
    .sort((a, b) => b.hours - a.hours)

  const maxHours = Math.max(...taskStats.map((s) => s.hours), 1)

  if (tasks.length === 0) {
    return (
      <section className="project-detail-page__blocks__project-analytics">
        <EmptyState title="No tasks to analyze" description="Add tasks to see analytics." />
      </section>
    )
  }

  return (
    <section className="project-detail-page__blocks__project-analytics flex flex-col gap-3">
      {taskStats.map(({ task, hours }) => (
        <div key={task.id} className="card px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-text-muted w-16 flex-shrink-0">{task.code}</span>
            <p className="text-sm font-medium flex-1 truncate">{task.title}</p>
            <Badge status={task.status} />
            <span className="text-sm font-semibold text-text w-12 text-right flex-shrink-0">
              {hours.toFixed(1)}h
            </span>
          </div>
          <div className="day-bar-track">
            <div
              className="day-bar-fill"
              style={{ width: `${(hours / maxHours) * 100}%` }}
              role="progressbar"
              aria-valuenow={hours}
              aria-valuemin={0}
              aria-valuemax={maxHours}
            />
          </div>
        </div>
      ))}
    </section>
  )
}
