interface Props {
  weekLabel: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  isCurrentWeek: boolean
}

export function WeekNav({ weekLabel, onPrev, onNext, onToday, isCurrentWeek }: Props) {
  return (
    <div className="week-nav" role="navigation" aria-label="Week navigation">
      <button type="button" className="btn btn-secondary" onClick={onPrev} aria-label="Previous week">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <span className="week-nav-label">{weekLabel}</span>
      <button type="button" className="btn btn-secondary" onClick={onNext} aria-label="Next week">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
      {!isCurrentWeek && (
        <button type="button" className="btn btn-ghost" onClick={onToday}>
          Today
        </button>
      )}
    </div>
  )
}
