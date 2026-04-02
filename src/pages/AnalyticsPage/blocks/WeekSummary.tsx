import { WeekAnalytics } from '../../../services/analyticsService'

interface Props {
  analytics: WeekAnalytics
}

export function WeekSummary({ analytics }: Props) {
  return (
    <section className="analytics-page__blocks__week-summary summary-card">
      <p className="summary-card-title">Week Summary</p>
      <div className="flex gap-8">
        <div className="summary-stat-row">
          <span className="summary-stat-value">{analytics.totalHours.toFixed(1)}</span>
          <span className="summary-stat-label">hours</span>
        </div>
        <div className="summary-stat-row">
          <span className="summary-stat-value">{analytics.entryCount}</span>
          <span className="summary-stat-label">entries</span>
        </div>
      </div>
    </section>
  )
}
