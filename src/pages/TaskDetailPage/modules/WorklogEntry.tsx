import { WorklogEntry as IWorklogEntry } from '../../../models'
import { useWorklogStore } from '../../../store/worklogStore'

interface Props {
  entry: IWorklogEntry
}

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`
}

export function WorklogEntryRow({ entry }: Props) {
  const { deleteEntry } = useWorklogStore()

  return (
    <div className="task-detail-page__modules__worklog-entry flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-mono text-text-muted whitespace-nowrap">{entry.date}</span>
          <span className="text-sm text-text-muted whitespace-nowrap">{formatHour(entry.startHour)}</span>
          <span className="text-sm font-semibold text-text whitespace-nowrap">{entry.durationHours}h</span>
        </div>
        {entry.comment && (
          <p className="text-sm text-text mt-0.5">{entry.comment}</p>
        )}
      </div>
      <button
        type="button"
        className="btn btn-danger p-1 flex-shrink-0"
        onClick={() => deleteEntry(entry.id)}
        aria-label="Delete worklog entry"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  )
}
