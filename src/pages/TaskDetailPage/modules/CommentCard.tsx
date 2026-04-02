import { useState } from 'react'
import { TaskComment } from '../../../models'
import { useCommentsStore } from '../../../store/commentsStore'

interface Props {
  comment: TaskComment
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function CommentCard({ comment }: Props) {
  const { updateComment, deleteComment } = useCommentsStore()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.text)

  const save = () => {
    if (text.trim()) {
      updateComment({ ...comment, text: text.trim() })
    }
    setEditing(false)
  }

  return (
    <div className="task-detail-page__modules__comment-card py-3 border-b border-border last:border-b-0">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="input"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Edit comment"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <p className="flex-1 text-sm text-text">{comment.text}</p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
            <button
              type="button"
              className="btn btn-ghost p-1"
              onClick={() => setEditing(true)}
              aria-label="Edit comment"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              type="button"
              className="btn btn-danger p-1"
              onClick={() => deleteComment(comment.id)}
              aria-label="Delete comment"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
