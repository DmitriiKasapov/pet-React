import { ProjectAnalytics } from '../../../services/analyticsService'
import { EmptyState } from '../../../components/elements/EmptyState'

interface Props {
  projects: ProjectAnalytics[]
}

export function ProjectsSummary({ projects }: Props) {
  return (
    <section className="analytics-page__blocks__projects-summary summary-card">
      <p className="summary-card-title">By Project</p>
      {projects.length === 0 ? (
        <EmptyState title="No project data" description="Log work to see project breakdown." />
      ) : (
        <div>
          {projects.map((p) => (
            <div key={p.projectId} className="project-bar-card">
              <div className="project-bar-content">
                <span className="text-sm font-medium">{p.name}</span>
                <span className="text-sm font-semibold">{p.hours.toFixed(1)}h</span>
              </div>
              <div
                className="project-bar-stripe"
                style={{ backgroundColor: p.color }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
