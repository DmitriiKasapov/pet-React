import { useForm } from 'react-hook-form'
import { useWorklogStore } from '../../../store/worklogStore'
import { ModalShell } from '../../../components/elements/ModalShell'
import { WorklogEntry } from '../../../models'
import { formatDate } from '../../../utils/boardUtils'

interface Props {
  taskId: string
  onClose: () => void
}

interface FormValues {
  date: string
  startHour: number
  durationHours: number
  comment: string
}

export function WorklogForm({ taskId, onClose }: Props) {
  const { createEntry } = useWorklogStore()

  const today = formatDate(new Date())

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { date: today, startHour: 9, durationHours: 1, comment: '' },
  })

  const onSubmit = (values: FormValues) => {
    const entry: WorklogEntry = {
      id: crypto.randomUUID(),
      taskId,
      date: values.date,
      startHour: Number(values.startHour),
      durationHours: Number(values.durationHours),
      comment: values.comment.trim(),
    }
    createEntry(entry)
    onClose()
  }

  return (
    <ModalShell title="Log Work" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          <div>
            <label className="field-label" htmlFor="wl-date">Date</label>
            <input id="wl-date" type="date" className="input" {...register('date', { required: true })} />
          </div>
          <div>
            <label className="field-label" htmlFor="wl-start">
              Start hour
              <span className="sr-only"> (0–23)</span>
            </label>
            <input
              id="wl-start"
              type="number"
              min={0}
              max={23}
              className="input"
              aria-describedby="wl-start-hint"
              {...register('startHour', { min: 0, max: 23, valueAsNumber: true })}
            />
            <span id="wl-start-hint" className="sr-only">Enter hour from 0 to 23</span>
            {errors.startHour && <p className="field-error" role="alert">Must be 0–23</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="wl-dur">
              Duration (hours)
              <span className="sr-only"> (0.5–12)</span>
            </label>
            <input
              id="wl-dur"
              type="number"
              min={0.5}
              max={12}
              step={0.5}
              className="input"
              aria-describedby="wl-dur-hint"
              {...register('durationHours', { min: 0.5, max: 12, valueAsNumber: true })}
            />
            <span id="wl-dur-hint" className="sr-only">Enter duration from 0.5 to 12 hours</span>
            {errors.durationHours && <p className="field-error" role="alert">Must be 0.5–12</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="wl-comment">Comment</label>
            <textarea id="wl-comment" className="input" rows={3} {...register('comment')} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Log Work</button>
          </div>
        </div>
      </form>
    </ModalShell>
  )
}
