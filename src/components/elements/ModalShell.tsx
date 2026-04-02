import { ReactNode, useEffect, useId, useRef } from 'react'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

export function ModalShell({ title, onClose, children }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const modalId = useId()

  // Focus modal on open, restore focus on close
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const firstFocusable = cardRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(firstFocusable ?? cardRef.current)?.focus()
    return () => previouslyFocused?.focus()
  }, [])

  // Close on Escape + focus trap on Tab
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !cardRef.current) return
      const nodes = Array.from(cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalId}
    >
      <div ref={cardRef} className="card w-full max-w-md max-h-[90vh] overflow-y-auto" tabIndex={-1}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 id={modalId} className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            className="btn btn-ghost p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
