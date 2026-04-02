import { NavLink } from 'react-router'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <NavLink to="/board" className="header-logo" aria-label="DevLog — home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="header-logo-text">DevLog</span>
        </NavLink>

        <nav className="header-nav" aria-label="Main navigation">
          <NavLink
            to="/board"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Week
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
