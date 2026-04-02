import { Outlet } from 'react-router'
import { AppHeader } from '../components/elements/AppHeader'
import { AppFooter } from '../components/elements/AppFooter'
import { useStoreInit } from '../hooks/useStoreInit'

export function AppLayout() {
  useStoreInit()

  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <AppFooter />
    </>
  )
}
