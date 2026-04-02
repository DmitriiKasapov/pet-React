import { DayAnalytics } from '../../../services/analyticsService'

interface Props {
  days: DayAnalytics[]
}

export function DaysSummary({ days }: Props) {
  const maxHours = Math.max(...days.map((d) => d.hours), 1)

  return (
    <section className="analytics-page__blocks__days-summary summary-card">
      <p className="summary-card-title">By Day</p>
      {days.map((day) => (
        <div key={day.date} className="day-bar-row">
          <span className="day-bar-label">{day.label}</span>
          <div className="day-bar-track" role="presentation">
            <div
              className="day-bar-fill"
              style={{ width: `${(day.hours / maxHours) * 100}%` }}
              role="progressbar"
              aria-valuenow={day.hours}
              aria-valuemin={0}
              aria-valuemax={maxHours}
              aria-label={`${day.label}: ${day.hours.toFixed(1)} hours`}
            />
          </div>
          <span className="day-bar-hours">{day.hours > 0 ? `${day.hours.toFixed(1)}h` : '—'}</span>
        </div>
      ))}
    </section>
  )
}
