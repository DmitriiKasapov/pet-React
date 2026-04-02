import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useProjectsStore } from '../../store/projectsStore'
import { useTasksStore } from '../../store/tasksStore'
import { useWorklogStore } from '../../store/worklogStore'
import { ProjectHeader } from './blocks/ProjectHeader'
import { TaskList } from './blocks/TaskList'
import { ProjectAnalytics } from './blocks/ProjectAnalytics'
import { TaskForm } from './modules/TaskForm'
import { ProjectForm } from '../ProjectsPage/modules/ProjectForm'
import { EmptyState } from '../../components/elements/EmptyState'
import { useShallow } from 'zustand/shallow'

type Tab = 'tasks' | 'analytics'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { projects } = useProjectsStore()
  const projectTasks = useTasksStore(useShallow((s) => s.tasks.filter((t) => t.projectId === id)))
  const { entries } = useWorklogStore()

  const [tab, setTab] = useState<Tab>('tasks')
  const [showForm, setShowForm] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="page-container">
        <EmptyState
          title="Project not found"
          description="This project does not exist or has been removed."
          action={<Link to="/projects" className="btn btn-secondary">Back to Projects</Link>}
        />
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="mb-2">
        <Link to="/projects" className="text-sm text-text-muted hover:text-text">
          ← Projects
        </Link>
      </div>

      <ProjectHeader project={project} tasks={projectTasks} entries={entries} onEdit={() => setShowEditProject(true)} />

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 border-b border-border"
        role="tablist"
        aria-label="Project sections"
      >
        {(['tasks', 'analytics'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {t === 'tasks' ? 'Tasks' : 'Analytics'}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <TaskList
          tasks={projectTasks}
          entries={entries}
          onCreate={() => setShowForm(true)}
        />
      )}

      {tab === 'analytics' && (
        <ProjectAnalytics tasks={projectTasks} entries={entries} />
      )}

      {showForm && (
        <TaskForm
          projectId={project.id}
          projectCode={project.code}
          onClose={() => setShowForm(false)}
        />
      )}

      {showEditProject && (
        <ProjectForm project={project} onClose={() => setShowEditProject(false)} />
      )}
    </div>
  )
}
