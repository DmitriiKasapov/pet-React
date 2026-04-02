import { useState, useMemo } from 'react'
import { useProjectsStore } from '../../store/projectsStore'
import { useTasksStore } from '../../store/tasksStore'
import { useWorklogStore } from '../../store/worklogStore'
import { getWeekAnalytics } from '../../services/analyticsService'
import { WeekSummary } from './blocks/WeekSummary'
import { DaysSummary } from './blocks/DaysSummary'
import { ProjectsSummary } from './blocks/ProjectsSummary'
import { TasksSummary } from './blocks/TasksSummary'
import { WeekNav } from '../../components/elements/WeekNav'
import { getWeekStart, formatDate, formatWeekLabel, addDays } from '../../utils/boardUtils'

export function AnalyticsPage() {
  const { projects } = useProjectsStore()
  const { tasks } = useTasksStore()
  const { entries } = useWorklogStore()

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))

  const analytics = useMemo(
    () => getWeekAnalytics(weekStart, entries, tasks, projects),
    [weekStart, entries, tasks, projects],
  )

  const currentWeekStart = formatDate(getWeekStart(new Date()))
  const isCurrentWeek = formatDate(weekStart) === currentWeekStart

  return (
    <div className="page-container">
      <div className="board-header">
        <h1>Analytics</h1>
        <WeekNav
          weekLabel={formatWeekLabel(weekStart)}
          onPrev={() => setWeekStart((d) => addDays(d, -7))}
          onNext={() => setWeekStart((d) => addDays(d, 7))}
          onToday={() => setWeekStart(getWeekStart(new Date()))}
          isCurrentWeek={isCurrentWeek}
        />
      </div>

      <div className="analytics-grid">
        <WeekSummary analytics={analytics} />
        <DaysSummary days={analytics.days} />
        <ProjectsSummary projects={analytics.projects} />
        <TasksSummary tasks={analytics.tasks} />
      </div>
    </div>
  )
}
