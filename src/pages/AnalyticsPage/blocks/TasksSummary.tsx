import { TaskAnalytics } from '../../../services/analyticsService'
import { Badge } from '../../../components/elements/Badge'
import { EmptyState } from '../../../components/elements/EmptyState'

interface Props {
  tasks: TaskAnalytics[]
}

export function TasksSummary({ tasks }: Props) {
  return (
    <section className="analytics-page__blocks__tasks-summary summary-card overflow-x-auto">
      <p className="summary-card-title">By Task</p>
      {tasks.length === 0 ? (
        <EmptyState title="No task data" description="Log work to see task breakdown." />
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th className="w-20">Code</th>
              <th>Title</th>
              <th className="col-project">Project</th>
              <th className="col-status">Status</th>
              <th className="text-right w-16">Hours</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.taskId}>
                <td className="font-mono text-xs text-text-muted">{t.code}</td>
                <td className="font-medium">{t.title}</td>
                <td className="col-project text-text-muted">{t.projectName}</td>
                <td className="col-status"><Badge status={t.status} /></td>
                <td className="text-right font-semibold">{t.hours.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
