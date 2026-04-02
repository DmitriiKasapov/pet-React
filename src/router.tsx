import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from './layouts/AppLayout'
import { Spinner } from './components/elements/Spinner'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })))
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage })))
const WeeklyBoardPage = lazy(() => import('./pages/WeeklyBoardPage').then((m) => ({ default: m.WeeklyBoardPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/board" replace /> },
      {
        path: 'board',
        element: <Suspense fallback={<PageFallback />}><WeeklyBoardPage /></Suspense>,
      },
      {
        path: 'projects',
        element: <Suspense fallback={<PageFallback />}><ProjectsPage /></Suspense>,
      },
      {
        path: 'projects/:id',
        element: <Suspense fallback={<PageFallback />}><ProjectDetailPage /></Suspense>,
      },
      {
        path: 'tasks/:id',
        element: <Suspense fallback={<PageFallback />}><TaskDetailPage /></Suspense>,
      },
      {
        path: 'analytics',
        element: <Suspense fallback={<PageFallback />}><AnalyticsPage /></Suspense>,
      },
    ],
  },
])
