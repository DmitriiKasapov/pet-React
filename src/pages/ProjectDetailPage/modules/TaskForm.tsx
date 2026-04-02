import { useForm } from 'react-hook-form'
import { useTasksStore } from '../../../store/tasksStore'
import { ModalShell } from '../../../components/elements/ModalShell'
import { Task, TaskStatus } from '../../../models'

interface Props {
  task?: Task
  projectId: string
  projectCode: string
  onClose: () => void
}

interface FormValues {
  title: string
  status: TaskStatus
  description: string
  estimateHours: number
}

export function TaskForm({ task, projectId, projectCode, onClose }: Props) {
  const { createTask, updateTask, tasks } = useTasksStore()
  const isEditing = !!task

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: task
      ? { title: task.title, status: task.status, description: task.description, estimateHours: task.estimateHours }
      : { status: 'planning', estimateHours: 4 },
  })

  const generateCode = () => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId)
    const maxNum = projectTasks.reduce((max, t) => {
      const match = t.code.match(/(\d+)$/)
      return match ? Math.max(max, parseInt(match[1], 10)) : max
    }, 0)
    return `${projectCode}-${String(maxNum + 1).padStart(3, '0')}`
  }

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateTask({ ...task, title: values.title.trim(), status: values.status, description: values.description.trim(), estimateHours: Number(values.estimateHours) })
    } else {
      createTask({
        id: crypto.randomUUID(),
        projectId,
        code: generateCode(),
        title: values.title.trim(),
        status: values.status,
        description: values.description.trim(),
        estimateHours: Number(values.estimateHours),
        createdAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  return (
    <ModalShell title={isEditing ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          <div>
            <label className="field-label" htmlFor="task-title">
              Title <span className="sr-only">(required)</span>
            </label>
            <input
              id="task-title"
              className="input"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'task-title-err' : undefined}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p id="task-title-err" className="field-error" role="alert">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="task-status">Status</label>
            <select id="task-status" className="input" {...register('status')}>
              <option value="planning">Planning</option>
              <option value="progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="task-estimate">Estimate (hours)</label>
            <input
              id="task-estimate"
              type="number"
              min="0.5"
              step="0.5"
              className="input"
              {...register('estimateHours', { min: 0.5, valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="task-desc">Description</label>
            <textarea id="task-desc" className="input" rows={3} {...register('description')} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Save' : 'Create Task'}</button>
          </div>
        </div>
      </form>
    </ModalShell>
  )
}
