import { useState } from 'react'
import { WorklogEntry } from '../../../models'
import { WorklogEntryRow } from '../modules/WorklogEntry'
import { WorklogForm } from '../modules/WorklogForm'
import { EmptyState } from '../../../components/elements/EmptyState'

interface Props {
  taskId: string
  entries: WorklogEntry[]
}

export function WorklogList({ taskId, entries }: Props) {
  const [showForm, setShowForm] = useState(false)
  const total = entries.reduce((sum, e) => sum + e.durationHours, 0)

  return (
    <section className="task-detail-page__blocks__worklog-list card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">
          Worklog
          {entries.length > 0 && (
            <span className="ml-2 text-sm font-normal text-text-muted">
              {total.toFixed(1)}h total
            </span>
          )}
        </h2>
        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(true)}>
          + Log Work
        </button>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="No worklog entries" description="Log your first work session." />
      ) : (
        <div>
          {entries.map((entry) => (
            <WorklogEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {showForm && <WorklogForm taskId={taskId} onClose={() => setShowForm(false)} />}
    </section>
  )
}
