import { useState, useMemo } from 'react'
import { useProjectsStore } from '../../store/projectsStore'
import { useTasksStore } from '../../store/tasksStore'
import { useWorklogStore } from '../../store/worklogStore'
import { BoardGrid } from './blocks/BoardGrid'
import { WeekNav } from '../../components/elements/WeekNav'
import { getWeekStart, formatDate, formatWeekLabel, addDays } from '../../utils/boardUtils'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyBoardPage() {
  const { projects } = useProjectsStore()
  const { tasks } = useTasksStore()
  const { entries } = useWorklogStore()

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))

  const todayStr = formatDate(new Date())

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i)
      return {
        date: formatDate(d),
        label: DAY_LABELS[i],
        dayNum: d.getDate(),
        isToday: formatDate(d) === todayStr,
      }
    }),
    [weekStart, todayStr],
  )

  const weekEntries = useMemo(() => {
    const weekDates = new Set(weekDays.map((d) => d.date))
    return entries.filter((e) => weekDates.has(e.date))
  }, [weekDays, entries])

  const currentWeekStart = formatDate(getWeekStart(new Date()))
  const isCurrentWeek = formatDate(weekStart) === currentWeekStart

  const weekLabel = formatWeekLabel(weekStart)

  return (
    <div className="page-container">
      <div className="board-header">
        <WeekNav
          weekLabel={weekLabel}
          onPrev={() => setWeekStart((d) => addDays(d, -7))}
          onNext={() => setWeekStart((d) => addDays(d, 7))}
          onToday={() => setWeekStart(getWeekStart(new Date()))}
          isCurrentWeek={isCurrentWeek}
        />
      </div>

      <BoardGrid
        weekDays={weekDays}
        entries={weekEntries}
        tasks={tasks}
        projects={projects}
      />
    </div>
  )
}
