import { useState, useMemo } from 'react'
import { Task, WorklogEntry } from '../../../models'
import { TaskCard } from '../modules/TaskCard'
import { EmptyState } from '../../../components/elements/EmptyState'
import { SearchInput } from '../../../components/elements/SearchInput'

interface Props {
  tasks: Task[]
  entries: WorklogEntry[]
  onCreate: () => void
}

export function TaskList({ tasks, entries, onCreate }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return tasks
    const q = query.toLowerCase()
    return tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
    )
  }, [tasks, query])

  return (
    <section className="project-detail-page__blocks__task-list">
      <div className="search-zone mb-4 flex items-center justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search tasks..." />
        <button type="button" className="btn btn-primary ml-3 flex-shrink-0" onClick={onCreate}>
          + New Task
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your search'}
          description={tasks.length === 0 ? 'Create the first task for this project.' : undefined}
          action={tasks.length === 0 ? (
            <button type="button" className="btn btn-primary" onClick={onCreate}>New Task</button>
          ) : undefined}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} entries={entries} />
          ))}
        </div>
      )}
    </section>
  )
}
