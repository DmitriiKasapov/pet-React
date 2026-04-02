import { useState } from 'react'
import { TaskComment } from '../../../models'
import { CommentCard } from '../modules/CommentCard'
import { useCommentsStore } from '../../../store/commentsStore'
import { EmptyState } from '../../../components/elements/EmptyState'
import { Pagination } from '../../../components/elements/Pagination'

const PAGE_SIZE = 6

interface Props {
  taskId: string
  comments: TaskComment[]
}

export function CommentsSection({ taskId, comments }: Props) {
  const { createComment } = useCommentsStore()
  const [text, setText] = useState('')
  const [page, setPage] = useState(1)

  const sorted = [...comments].reverse()
  const pagedComments = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    createComment({
      id: crypto.randomUUID(),
      taskId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    })
    setText('')
    setPage(1) // newest first → new comment is at the top (page 1)
  }

  return (
    <section className="task-detail-page__blocks__comments-section card p-6">
      <h2 className="text-base font-semibold mb-4">Comments</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="sr-only" htmlFor="new-comment">Add a comment</label>
        <textarea
          id="new-comment"
          className="input"
          rows={3}
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
            Post
          </button>
        </div>
      </form>

      <hr className="my-5 border-border" />

      {comments.length === 0 ? (
        <EmptyState title="No comments yet" description="Be the first to leave a comment." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pagedComments.map((c) => <CommentCard key={c.id} comment={c} />)}
          </div>
          <Pagination
            page={page}
            total={comments.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  )
}
