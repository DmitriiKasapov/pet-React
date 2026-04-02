import { useForm } from 'react-hook-form'
import { useProjectsStore } from '../../../store/projectsStore'
import { ModalShell } from '../../../components/elements/ModalShell'
import { Project } from '../../../models'

interface Props {
  project?: Project
  onClose: () => void
}

interface FormValues {
  name: string
  code: string
  color: string
  description: string
}

const PRESET_COLORS = [
  '#3b5bdb', '#2f9e44', '#e67700', '#c92a2a',
  '#862e9c', '#1098ad', '#f59f00', '#495057',
]

export function ProjectForm({ project, onClose }: Props) {
  const { createProject, updateProject, projects } = useProjectsStore()
  const isEditing = !!project

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: project
      ? { name: project.name, code: project.code, color: project.color, description: project.description }
      : { color: PRESET_COLORS[0] },
  })

  const selectedColor = watch('color')

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateProject({ ...project, name: values.name.trim(), code: values.code.trim().toUpperCase(), color: values.color, description: values.description.trim() })
    } else {
      createProject({
        id: crypto.randomUUID(),
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
        color: values.color,
        description: values.description.trim(),
        createdAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  const isCodeTaken = (code: string) => {
    const upper = code.trim().toUpperCase()
    return projects.some((p) => p.code === upper && p.id !== project?.id)
  }

  return (
    <ModalShell title={isEditing ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="field-label" htmlFor="proj-name">
              Name <span className="sr-only">(required)</span>
            </label>
            <input
              id="proj-name"
              className="input"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'proj-name-err' : undefined}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p id="proj-name-err" className="field-error" role="alert">{errors.name.message}</p>
            )}
          </div>

          {/* Code */}
          <div>
            <label className="field-label" htmlFor="proj-code">
              Code <span className="sr-only">(required)</span>
            </label>
            <input
              id="proj-code"
              className="input"
              placeholder="e.g. DL"
              aria-invalid={!!errors.code}
              aria-describedby={errors.code ? 'proj-code-err' : undefined}
              {...register('code', {
                required: 'Code is required',
                validate: (v) => !isCodeTaken(v) || 'Code already in use',
              })}
            />
            {errors.code && (
              <p id="proj-code-err" className="field-error" role="alert">{errors.code.message}</p>
            )}
          </div>

          {/* Color */}
          <fieldset>
            <legend className="field-label">Color</legend>
            <div className="flex gap-2 flex-wrap mt-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  aria-label={`Color ${color}`}
                  aria-pressed={selectedColor === color}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? color : 'transparent',
                    outline: selectedColor === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <label className="field-label" htmlFor="proj-desc">Description</label>
            <textarea
              id="proj-desc"
              className="input"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Save' : 'Create Project'}</button>
          </div>
        </div>
      </form>
    </ModalShell>
  )
}
