import { Link } from 'react-router'
import { Project, Task, WorklogEntry } from '../../../models'

interface Props {
  project: Project
  tasks: Task[]
  entries: WorklogEntry[]
}

export function ProjectCard({ project, tasks, entries }: Props) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const taskIds = new Set(projectTasks.map((t) => t.id))
  const totalHours = entries
    .filter((e) => taskIds.has(e.taskId))
    .reduce((sum, e) => sum + e.durationHours, 0)

  return (
    <Link
      to={`/projects/${project.id}`}
      className="projects-page__modules__project-card flex items-center gap-0 card hover:shadow-md transition-shadow"
      aria-label={`Project ${project.name}`}
    >
      {/* Color accent */}
      <div
        className="w-1 self-stretch rounded-l-lg flex-shrink-0"
        style={{ backgroundColor: project.color }}
        aria-hidden="true"
      />
      <div className="flex-1 px-4 py-3 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded text-white shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.code}
            </span>
            <p className="font-semibold text-sm truncate text-text">{project.name}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs text-text-muted">
            <span>{projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}</span>
            <span>{totalHours.toFixed(1)}h</span>
          </div>
        </div>
        {project.description && (
          <p className="text-xs text-text-muted truncate mt-0.5">{project.description}</p>
        )}
      </div>
    </Link>
  )
}
