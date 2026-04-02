import { useEffect, useRef, useMemo, useState, useCallback, CSSProperties } from 'react'
import { WorklogEntry, Task, Project } from '../../../models'
import { useWorklogStore } from '../../../store/worklogStore'
import { WorklogBlock } from '../modules/WorklogBlock'
import { BoardWorklogForm } from '../modules/BoardWorklogForm'
import { HOUR_HEIGHT, MIN_DURATION, snapToGrid, clampHours } from '../../../utils/boardUtils'

const HOURS = Array.from({ length: 25 }, (_, i) => i)
const DAILY_NORM = 8
const HEADER_HEIGHT = 40

interface DragState {
  entryId: string
  originalDate: string
  originalStartHour: number
  originalDurationHours: number
  startMouseX: number
  startMouseY: number
  currentMouseX: number
  currentMouseY: number
  blockOffsetX: number
  blockOffsetY: number
  blockWidth: number
}

interface ResizeState {
  entryId: string
  originalDuration: number
  originalStartHour: number
  startMouseY: number
  currentMouseY: number
}

interface Props {
  weekDays: Array<{ date: string; label: string; dayNum: number; isToday: boolean }>
  entries: WorklogEntry[]
  tasks: Task[]
  projects: Project[]
}

export function BoardGrid({ weekDays, entries, tasks, projects }: Props) {
  const { updateEntry, deleteEntry } = useWorklogStore()
  const sectionRef = useRef<HTMLElement>(null)
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  // Suppresses column click that fires after drag/resize mouseup
  const suppressNextClickRef = useRef(false)

  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)
  const [formState, setFormState] = useState<{ date: string; hour: number; edit?: WorklogEntry } | null>(null)

  // Scroll to business hours on mount
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollTop = 5 * HOUR_HEIGHT - HEADER_HEIGHT
    }
  }, [])

  // Build task info map
  const taskInfoMap = useMemo(() => {
    const map = new Map<string, { color: string; code: string; title: string }>()
    for (const task of tasks) {
      const project = projects.find((p) => p.id === task.projectId)
      map.set(task.id, { color: project?.color ?? '#3b5bdb', code: task.code, title: task.title })
    }
    return map
  }, [tasks, projects])

  // Total logged hours per day
  const hoursPerDay = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      map[e.date] = (map[e.date] ?? 0) + e.durationHours
    }
    return map
  }, [entries])

  const getDateAtX = useCallback((clientX: number): string | null => {
    for (const [date, el] of columnRefs.current.entries()) {
      const rect = el.getBoundingClientRect()
      if (clientX >= rect.left && clientX <= rect.right) return date
    }
    return null
  }, [])

  // Resize preview height
  const resizePreviewHeight = useMemo(() => {
    if (!resizeState) return 0
    const dy = resizeState.currentMouseY - resizeState.startMouseY
    return (
      snapToGrid(clampHours(resizeState.originalDuration + dy / HOUR_HEIGHT, MIN_DURATION, 24 - resizeState.originalStartHour)) *
      HOUR_HEIGHT
    )
  }, [resizeState])

  // Ghost preview position for a given day during drag
  const dragPreviewForDay = useCallback((date: string): number | null => {
    if (!dragState) return null
    const targetDate = getDateAtX(dragState.currentMouseX)
    if (targetDate !== date) return null
    const colEl = columnRefs.current.get(date)
    if (!colEl) return null
    const colTop = colEl.getBoundingClientRect().top
    return snapToGrid(
      clampHours((dragState.currentMouseY - dragState.blockOffsetY - colTop) / HOUR_HEIGHT, 0, 24 - dragState.originalDurationHours)
    )
  }, [dragState, getDateAtX])

  // Floating drag overlay style
  const dragFloatStyle = useMemo((): CSSProperties => {
    if (!dragState) return { display: 'none' }
    return {
      position: 'fixed',
      left: dragState.currentMouseX - dragState.blockOffsetX,
      top: dragState.currentMouseY - dragState.blockOffsetY,
      width: dragState.blockWidth,
      pointerEvents: 'none',
      zIndex: 1000,
    }
  }, [dragState])

  // Mouse move / up on document
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setDragState((ds) => ds ? { ...ds, currentMouseX: e.clientX, currentMouseY: e.clientY } : null)
      setResizeState((rs) => rs ? { ...rs, currentMouseY: e.clientY } : null)
    }

    const onMouseUp = (e: MouseEvent) => {
      setDragState((ds) => {
        if (ds) {
          suppressNextClickRef.current = true
          const targetDate = getDateAtX(e.clientX) ?? ds.originalDate
          const colEl = columnRefs.current.get(targetDate)
          const colTop = colEl?.getBoundingClientRect().top ?? 0
          const newStartHour = snapToGrid(
            clampHours((e.clientY - ds.blockOffsetY - colTop) / HOUR_HEIGHT, 0, 24 - ds.originalDurationHours)
          )
          const entry = entries.find((en) => en.id === ds.entryId)
          if (entry && (targetDate !== ds.originalDate || newStartHour !== ds.originalStartHour)) {
            updateEntry({ ...entry, date: targetDate, startHour: newStartHour })
          }
        }
        return null
      })

      setResizeState((rs) => {
        if (rs) {
          suppressNextClickRef.current = true
          const dy = e.clientY - rs.startMouseY
          const newDuration = snapToGrid(
            clampHours(rs.originalDuration + dy / HOUR_HEIGHT, MIN_DURATION, 24 - rs.originalStartHour)
          )
          const entry = entries.find((en) => en.id === rs.entryId)
          if (entry && newDuration !== rs.originalDuration) {
            updateEntry({ ...entry, durationHours: newDuration })
          }
        }
        return null
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [entries, updateEntry, getDateAtX])

  const handleBlockDragStart = useCallback((entry: WorklogEntry, e: React.MouseEvent, blockEl: HTMLElement) => {
    e.preventDefault()
    const rect = blockEl.getBoundingClientRect()
    setDragState({
      entryId: entry.id,
      originalDate: entry.date,
      originalStartHour: entry.startHour,
      originalDurationHours: entry.durationHours,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      currentMouseX: e.clientX,
      currentMouseY: e.clientY,
      blockOffsetX: e.clientX - rect.left,
      blockOffsetY: e.clientY - rect.top,
      blockWidth: rect.width,
    })
  }, [])

  const handleResizeStart = useCallback((entry: WorklogEntry, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizeState({
      entryId: entry.id,
      originalDuration: entry.durationHours,
      originalStartHour: entry.startHour,
      startMouseY: e.clientY,
      currentMouseY: e.clientY,
    })
  }, [])

  const handleColumnClick = useCallback((e: React.MouseEvent<HTMLDivElement>, date: string) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const startHour = snapToGrid(clampHours((e.clientY - rect.top) / HOUR_HEIGHT, 0, 23.5))
    setFormState({ date, hour: startHour })
  }, [])

  const dragEntry = dragState ? entries.find((e) => e.id === dragState.entryId) : null

  return (
    <section
      ref={sectionRef}
      className="weekly-board-page__blocks__board-grid board-calendar"
    >
      {/* Sticky header */}
      <div className="board-head">
        <div className="board-head-spacer" />
        <div className="board-head-days">
          {weekDays.map((day) => (
            <div key={day.date} className={`board-day-header${day.isToday ? ' is-today' : ''}`}>
              <span className="day-title">
                <span className="day-label">{day.label}</span>
                <span className="day-num">{day.dayNum}</span>
              </span>
              <span className="day-hours">{DAILY_NORM}/{hoursPerDay[day.date] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body: time ruler + columns */}
      <div className="board-body">
        {/* Time ruler */}
        <div className="board-time-col">
          {HOURS.map((h) => (
            h < 24 ? (
              <div key={h} className="board-hour-label" style={{ top: h * HOUR_HEIGHT }}>
                {String(h).padStart(2, '0')}:00
              </div>
            ) : null
          ))}
        </div>

        {/* Day columns */}
        <div className="board-days-grid">
          {weekDays.map((day) => {
            const dayEntries = entries.filter((e) => e.date === day.date)
            const preview = dragPreviewForDay(day.date)

            return (
              <div
                key={day.date}
                ref={(el) => { el ? columnRefs.current.set(day.date, el) : columnRefs.current.delete(day.date) }}
                className={`board-day-col${day.isToday ? ' is-today' : ''}`}
                onClick={(e) => handleColumnClick(e, day.date)}
              >
                {/* Hour grid lines */}
                {HOURS.map((h) => (
                  <div key={h} className="board-hour-line" style={{ top: h * HOUR_HEIGHT }} aria-hidden="true" />
                ))}

                {/* Drag preview ghost */}
                {preview !== null && dragState && (
                  <div
                    className="board-drag-preview"
                    style={{
                      top: preview * HOUR_HEIGHT,
                      height: dragState.originalDurationHours * HOUR_HEIGHT,
                    }}
                  />
                )}

                {/* Worklog entries */}
                {dayEntries.map((entry) => {
                  const info = taskInfoMap.get(entry.taskId) ?? { color: '#3b5bdb', code: '', title: 'Unknown' }
                  const isRes = resizeState?.entryId === entry.id
                  const height = isRes ? resizePreviewHeight : entry.durationHours * HOUR_HEIGHT

                  return (
                    <WorklogBlock
                      key={entry.id}
                      entry={entry}
                      taskInfo={info}
                      isDragging={dragState?.entryId === entry.id}
                      isResizing={isRes}
                      style={{ top: entry.startHour * HOUR_HEIGHT, height }}
                      onDragStart={(e, el) => handleBlockDragStart(entry, e, el)}
                      onResizeStart={(e) => handleResizeStart(entry, e)}
                      onEdit={() => setFormState({ date: entry.date, hour: entry.startHour, edit: entry })}
                      onDelete={() => deleteEntry(entry.id)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating drag overlay */}
      {dragEntry && (() => {
        const info = taskInfoMap.get(dragEntry.taskId)
        return (
          <div className="board-drag-float" style={dragFloatStyle}>
            <span className="board-drag-float-code">{info?.code}</span>
            <span className="board-drag-float-hours">{dragEntry.durationHours}h</span>
          </div>
        )
      })()}

      {formState && (
        <BoardWorklogForm
          tasks={tasks}
          defaultDate={formState.date}
          defaultHour={formState.hour}
          editEntry={formState.edit}
          onClose={() => setFormState(null)}
        />
      )}
    </section>
  )
}
