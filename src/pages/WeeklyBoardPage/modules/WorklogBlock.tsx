import { WorklogEntry } from '../../../models'

interface TaskInfo {
  color: string
  code: string
  title: string
}

interface Props {
  entry: WorklogEntry
  taskInfo: TaskInfo
  isDragging: boolean
  isResizing: boolean
  style: React.CSSProperties
  onDragStart: (e: React.MouseEvent, el: HTMLElement) => void
  onResizeStart: (e: React.MouseEvent) => void
  onEdit: () => void
  onDelete: () => void
}

export function WorklogBlock({ entry, taskInfo, isDragging, isResizing, style, onDragStart, onResizeStart, onEdit, onDelete }: Props) {
  return (
    <div
      className={`worklog-block${isDragging ? ' worklog-block--dragging' : ''}${isResizing ? ' worklog-block--resizing' : ''}`}
      style={{ ...style, borderLeftColor: taskInfo.color }}
      onMouseDown={(e) => { e.stopPropagation(); onDragStart(e, e.currentTarget) }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="worklog-block-content">
        <span className="worklog-block-code">{taskInfo.code}</span>
        <span className="worklog-block-title">{taskInfo.title}</span>
        {entry.comment && <span className="worklog-block-comment">{entry.comment}</span>}
        <span className="worklog-block-hours">{entry.durationHours}h</span>
      </div>

      <button
        type="button"
        className="worklog-btn-edit"
        aria-label="Edit entry"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onEdit() }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M8.5 1.5l2 2L4 10H2v-2l6.5-6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        className="worklog-btn-delete"
        aria-label="Delete entry"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onDelete() }}
      >
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className="worklog-resize-handle"
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e) }}
      />
    </div>
  )
}
