import { Project, Task, WorklogEntry } from '../../../models'

interface Props {
  project: Project
  tasks: Task[]
  entries: WorklogEntry[]
  onEdit: () => void
}

export function ProjectHeader({ project, tasks, entries, onEdit }: Props) {
  const taskIds = new Set(tasks.map((t) => t.id))
  const totalHours = entries
    .filter((e) => taskIds.has(e.taskId))
    .reduce((sum, e) => sum + e.durationHours, 0)

  return (
    <section className="project-detail-page__blocks__project-header card p-6 mb-6">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        >
          {project.code}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold truncate">{project.name}</h1>
            <button type="button" className="btn btn-ghost p-1 shrink-0" onClick={onEdit} aria-label="Edit project">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          {project.description && (
            <p className="text-sm text-text-muted mt-1">{project.description}</p>
          )}
          <dl className="flex gap-6 mt-3">
            <div>
              <dt className="sr-only">Tasks</dt>
              <dd className="text-sm font-semibold">{tasks.length} <span className="font-normal text-text-muted">tasks</span></dd>
            </div>
            <div>
              <dt className="sr-only">Hours logged</dt>
              <dd className="text-sm font-semibold">{totalHours.toFixed(1)} <span className="font-normal text-text-muted">hours logged</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
