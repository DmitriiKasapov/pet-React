import { Link } from 'react-router'
import { Task, TaskStatus, Project } from '../../../models'
import { Badge } from '../../../components/elements/Badge'
import { useTasksStore } from '../../../store/tasksStore'

const STATUS_OPTIONS: { value: TaskStatus; label: string; active: string; idle: string }[] = [
  { value: 'planning',  label: 'Planning',    active: 'bg-status-planning  text-status-planning-text',  idle: 'bg-surface text-text-muted hover:bg-bg hover:text-text' },
  { value: 'progress',  label: 'In Progress', active: 'bg-status-progress  text-status-progress-text',  idle: 'bg-surface text-text-muted hover:bg-bg hover:text-text' },
  { value: 'done',      label: 'Done',        active: 'bg-status-done      text-status-done-text',       idle: 'bg-surface text-text-muted hover:bg-bg hover:text-text' },
]

interface Props {
  task: Task
  project: Project | undefined
  onEdit: () => void
}

export function TaskHeader({ task, project, onEdit }: Props) {
  const { updateStatus } = useTasksStore()

  return (
    <section className="task-detail-page__blocks__task-header card p-6 mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-text-muted mb-4 list-none p-0 m-0">
          <li><Link to="/projects" className="hover:text-text">Projects</Link></li>
          <li aria-hidden="true">›</li>
          {project && (
            <>
              <li>
                <Link to={`/projects/${project.id}`} className="hover:text-text">
                  {project.name}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
            </>
          )}
          <li aria-current="page" className="text-text font-medium">{task.code}</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-text-muted">{task.code}</span>
            <Badge status={task.status} />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{task.title}</h1>
            <button type="button" className="btn btn-ghost p-1 shrink-0" onClick={onEdit} aria-label="Edit task">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          {task.description && (
            <p className="text-sm text-text-muted mt-2">{task.description}</p>
          )}
          <dl className="flex gap-6 mt-3">
            <div>
              <dt className="sr-only">Estimate</dt>
              <dd className="text-sm">
                <span className="font-semibold">{task.estimateHours}h</span>{' '}
                <span className="text-text-muted">estimate</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="shrink-0">
          <p className="field-label mb-1">Status</p>
          <div className="inline-flex border border-border rounded overflow-hidden" role="group" aria-label="Task status">
            {STATUS_OPTIONS.map(({ value, label, active, idle }, i) => (
              <button
                key={value}
                type="button"
                className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${i < STATUS_OPTIONS.length - 1 ? 'border-r border-border' : ''} ${task.status === value ? active : idle}`}
                onClick={() => updateStatus(task.id, value)}
                aria-pressed={task.status === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
