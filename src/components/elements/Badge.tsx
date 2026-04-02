import { TaskStatus } from '../../models'

interface Props {
  status: TaskStatus
}

const labels: Record<TaskStatus, string> = {
  planning: 'Planning',
  progress: 'In Progress',
  done: 'Done',
}

export function Badge({ status }: Props) {
  return (
    <span className={`badge badge-${status}`}>
      {labels[status]}
    </span>
  )
}
