# DevLog — Time Tracking App

A single-page application for tracking work time and managing tasks across projects.  
Built with React 19 as a portfolio project — no backend, no database, runs entirely in the browser.

---

## Quick Start

**Requirements:** Node.js 18+, npm

```bash
# Clone the repository
git clone https://github.com/DmitriiKasapov/pet-react.git
cd pet-react

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL shown in the terminal in your browser.

> On first launch the app automatically loads demo data: 3 projects, 11 tasks, 15 worklog entries and 5 comments — so you can explore all features right away.

---

## Data Storage

All data is stored in **localStorage** — nothing is sent to any server.  
To reset to the original demo data, open DevTools → Application → Local Storage → clear all keys starting with `devlog:`.

---

## Tests

```bash
npm test
```

Business logic is covered by unit tests (`analyticsService.test.ts`) using **Vitest**.

---

## Tech Stack

- **React 19** — function components, hooks, lazy-loaded routes
- **TypeScript** — strict typing throughout
- **Vite** — fast development server and build tool
- **React Router v7** — client-side routing
- **Zustand** — lightweight global state management
- **React Hook Form** — form validation and control
- **Tailwind CSS v4** — utility-first styling with design tokens
- **Vitest** — unit testing
- **No external UI libraries** — all components are handcrafted

---

## Patterns & Architecture

- **Feature-based folder structure** — each page owns its `blocks/` (sections) and `modules/` (forms, cards); shared UI lives in `components/elements/`
- **Service layer** — all localStorage access is encapsulated in services (`storageService`, `seedService`, `analyticsService`); components never touch storage directly
- **Zustand stores** — one store per domain entity (`projects`, `tasks`, `worklog`, `comments`); each store delegates persistence to `storageService`; cross-store operations (e.g. cascade delete) use `store.getState()` directly
- **Seed + localStorage pattern** — demo data is loaded once on first launch and then read/written exclusively from localStorage; no re-seeding on subsequent visits
- **Scoped re-renders with `useShallow`** — selectors return filtered subsets of store data so components only re-render when their specific slice changes
- **Custom drag-and-drop engine** — the weekly board uses a hand-rolled mouse-event drag/resize system instead of a library, giving precise control over snap-to-grid, ghost preview and column hit-testing
- **Pure analytics service** — `analyticsService` is a plain function with no React or store dependency; it receives data and returns derived analytics, making it trivially testable
- **Design tokens via `@theme`** — all colors, radii and shadows are declared as CSS custom properties in Tailwind v4's `@theme` block and consumed as utility classes (`bg-primary`, `text-text-muted`, `rounded-md`)
- **`@layer components` + `@apply`** — reusable UI classes (`.btn`, `.input`, `.card`, `.badge`) are defined with `@apply` in dedicated CSS files, keeping JSX clean without a component library
- **Timezone-safe dates** — all YYYY-MM-DD strings are produced via a local-timezone `formatDate()` utility, not `toISOString()`, to avoid UTC boundary mismatches

---

## Features

### Week Board `/board` ← default page
- Visual time grid for the current week (Mon–Sun)
- All logged work entries displayed as blocks on the grid
- **Click any column** to log a new work entry for that day
- **Drag blocks** between days to move an entry
- **Resize blocks** by dragging the bottom edge to adjust duration
- **Edit or delete** any entry via hover controls
- Navigate between weeks with Prev / Next; jump back with Today

### Projects `/projects`
- View all projects as a list with name, code, color and description
- **Create a project** — name, short code (e.g. `INT`), description, color
- **Search** projects by name or code
- Click a project to open its detail page

### Project detail `/projects/:id`
- **Edit project** — update name, code, color or description inline
- **Tasks tab** — list of all tasks with status badges and logged hours
  - Search tasks by code or title
  - **Create a task** — title, description, status, estimated hours
  - Click a task to open its detail page
- **Analytics tab** — hours logged per task with progress bars, sorted by most time spent

### Task detail `/tasks/:id`
- Full task info: code, title, description, status, estimate
- **Edit task** — update any field without leaving the page
- **Change status** — Planning → In Progress → Done
- **Log work** — date, start time, duration, optional comment
- Work log list with total hours
- **Comments** — add, edit and delete comments; newest first, paginated at 6 per page

### Analytics `/analytics`
- Weekly summary: total hours and entry count
- **Hours by day** — bar chart for each day of the week
- **Hours by project** — colored bars per project, sorted by most time
- **Hours by task** — table with task code, title, project, status and hours
- Navigate between weeks; jump back with Today

---

## Accessibility

- Keyboard navigation and focus management throughout
- Modal dialogs trap focus and restore it on close
- All interactive elements have visible focus states and `aria-label` where needed
- Forms use `aria-invalid` + `aria-describedby` to associate error messages with inputs
- Semantic HTML: `<nav>`, `<section>`, `<dl>`, breadcrumb `<ol>`, `role="group"` on status switchers
