import { useState, useMemo } from 'react'
import { useProjectsStore } from '../../store/projectsStore'
import { useTasksStore } from '../../store/tasksStore'
import { useWorklogStore } from '../../store/worklogStore'
import { ProjectList } from './blocks/ProjectList'
import { ProjectForm } from './modules/ProjectForm'
import { SearchInput } from '../../components/elements/SearchInput'

export function ProjectsPage() {
  const { projects } = useProjectsStore()
  const { tasks } = useTasksStore()
  const { entries } = useWorklogStore()

  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    if (!query.trim()) return projects
    const q = query.toLowerCase()
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
    )
  }, [projects, query])

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1>Projects</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Project
        </button>
      </div>

      <div className="search-zone mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search projects..." />
      </div>

      <ProjectList
        projects={filtered}
        tasks={tasks}
        entries={entries}
        onCreate={() => setShowForm(true)}
      />

      {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
