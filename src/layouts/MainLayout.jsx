import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="main-col">
        <TopHeader onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
