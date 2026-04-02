import { Project, Task, WorklogEntry } from '../../../models'
import { ProjectCard } from '../modules/ProjectCard'
import { EmptyState } from '../../../components/elements/EmptyState'

interface Props {
  projects: Project[]
  tasks: Task[]
  entries: WorklogEntry[]
  onCreate: () => void
}

export function ProjectList({ projects, tasks, entries, onCreate }: Props) {
  if (projects.length === 0) {
    return (
      <section className="projects-page__blocks__project-list">
        <EmptyState
          title="No projects found"
          description="Create your first project to start tracking time."
          action={
            <button type="button" className="btn btn-primary" onClick={onCreate}>
              New Project
            </button>
          }
        />
      </section>
    )
  }

  return (
    <section className="projects-page__blocks__project-list flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} tasks={tasks} entries={entries} />
      ))}
    </section>
  )
}
