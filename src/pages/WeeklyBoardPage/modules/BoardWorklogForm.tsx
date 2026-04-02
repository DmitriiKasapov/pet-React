import { useState, useRef, useEffect } from 'react'
import { useWorklogStore } from '../../../store/worklogStore'
import { ModalShell } from '../../../components/elements/ModalShell'
import { Task, WorklogEntry } from '../../../models'

interface Props {
  tasks: Task[]
  defaultDate: string
  defaultHour: number
  editEntry?: WorklogEntry
  onClose: () => void
}

export function BoardWorklogForm({ tasks, defaultDate, defaultHour, editEntry, onClose }: Props) {
  const { createEntry, updateEntry } = useWorklogStore()

  const [searchQuery, setSearchQuery] = useState(() => {
    if (editEntry) {
      const t = tasks.find((t) => t.id === editEntry.taskId)
      return t ? `${t.code} — ${t.title}` : ''
    }
    return ''
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(() =>
    editEntry ? (tasks.find((t) => t.id === editEntry.taskId) ?? null) : null,
  )
  const [comment, setComment] = useState(editEntry?.comment ?? '')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filteredTasks = searchQuery && !selectedTask
    ? tasks.filter((t) =>
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tasks

  const selectTask = (task: Task) => {
    setSelectedTask(task)
    setSearchQuery(`${task.code} — ${task.title}`)
    setDropdownOpen(false)
    setActiveIndex(-1)
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    setSelectedTask(null)
    setDropdownOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!dropdownOpen || filteredTasks.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filteredTasks.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectTask(filteredTasks[activeIndex])
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleBlur = () => {
    closeTimer.current = setTimeout(() => {
      setDropdownOpen(false)
      setActiveIndex(-1)
    }, 150)
  }

  // Cancel close timer when clicking a dropdown option
  const handleDropdownMouseDown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask) return

    if (editEntry) {
      updateEntry({ ...editEntry, taskId: selectedTask.id, comment: comment.trim() || '' })
    } else {
      createEntry({
        id: crypto.randomUUID(),
        taskId: selectedTask.id,
        date: defaultDate,
        startHour: defaultHour,
        durationHours: 1,
        comment: comment.trim() || '',
      })
    }
    onClose()
  }

  return (
    <ModalShell title={editEntry ? 'Edit Entry' : 'Log Work'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Task combobox */}
        <div className="input-field">
          <label className="field-label" htmlFor="wbf-task">Task</label>
          <div className="relative">
            <input
              id="wbf-task"
              type="text"
              className="input w-full"
              placeholder="Search by code or title…"
              value={searchQuery}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              aria-owns="wbf-task-listbox"
              aria-activedescendant={activeIndex >= 0 ? `wbf-option-${activeIndex}` : undefined}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {dropdownOpen && filteredTasks.length > 0 && (
              <ul
                id="wbf-task-listbox"
                role="listbox"
                aria-label="Available tasks"
                className="absolute z-10 w-full mt-1 rounded-lg overflow-y-auto max-h-48"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-modal)' }}
                onMouseDown={handleDropdownMouseDown}
              >
                {filteredTasks.map((task, i) => (
                  <li
                    key={task.id}
                    id={`wbf-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`px-3 py-2 text-sm cursor-pointer${i === activeIndex ? ' bg-bg' : ''}`}
                    style={{ color: 'var(--color-text)' }}
                    onMouseDown={() => selectTask(task)}
                  >
                    <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{task.code}</span>
                    <span className="ml-2">{task.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="input-field">
          <label className="field-label" htmlFor="wbf-comment">
            Comment <span style={{ color: 'var(--color-text-light)' }}>optional</span>
          </label>
          <textarea
            id="wbf-comment"
            rows={2}
            placeholder="What did you work on?"
            className="input resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!selectedTask}>
            {editEntry ? 'Save' : 'Add Entry'}
          </button>
        </div>

      </form>
    </ModalShell>
  )
}
