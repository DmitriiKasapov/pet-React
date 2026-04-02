import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useTasksStore } from '../../store/tasksStore'
import { useProjectsStore } from '../../store/projectsStore'
import { useWorklogStore } from '../../store/worklogStore'
import { useCommentsStore } from '../../store/commentsStore'
import { useShallow } from 'zustand/shallow'
import { TaskHeader } from './blocks/TaskHeader'
import { WorklogList } from './blocks/WorklogList'
import { CommentsSection } from './blocks/CommentsSection'
import { EmptyState } from '../../components/elements/EmptyState'
import { TaskForm } from '../ProjectDetailPage/modules/TaskForm'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const task = useTasksStore((s) => s.tasks.find((t) => t.id === id))
  const { projects } = useProjectsStore()
  const taskEntries = useWorklogStore(useShallow((s) => s.entries.filter((e) => e.taskId === id)))
  const taskComments = useCommentsStore(useShallow((s) => s.comments.filter((c) => c.taskId === id)))

  const [showEditTask, setShowEditTask] = useState(false)

  const project = task ? projects.find((p) => p.id === task.projectId) : undefined

  if (!task) {
    return (
      <div className="page-container">
        <EmptyState
          title="Task not found"
          description="This task does not exist or has been removed."
          action={<Link to="/projects" className="btn btn-secondary">Back to Projects</Link>}
        />
      </div>
    )
  }

  return (
    <div className="page-container">
      <TaskHeader task={task} project={project} onEdit={() => setShowEditTask(true)} />
      <WorklogList taskId={task.id} entries={taskEntries} />
      <CommentsSection taskId={task.id} comments={taskComments} />

      {showEditTask && (
        <TaskForm
          task={task}
          projectId={task.projectId}
          projectCode={project?.code ?? ''}
          onClose={() => setShowEditTask(false)}
        />
      )}
    </div>
  )
}
