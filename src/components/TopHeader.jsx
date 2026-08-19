import { useAppData } from '../context/AppDataContext'
import { formatDate } from '../utils/format'

export default function TopHeader({ onToggleSidebar }) {
  const { settings } = useAppData()

  return (
    <header className="top-header">
      <div className="flex items-center gap-12">
        <button className="btn btn-ghost btn-icon-only" onClick={onToggleSidebar} style={{ display: 'none' }} id="sidebar-toggle">☰</button>
        <div className="top-header-title">
          <h1>{settings.name}</h1>
          <p>{settings.subtitle}</p>
        </div>
      </div>
      <div className="top-header-right">
        <span className="demo-badge">DEMO VERSION</span>
        <span className="header-date">{formatDate(new Date().toISOString(), { weekday: 'short' })}</span>
        <div className="header-user">
          <div className="header-user-avatar">LA</div>
          <div>
            <div className="header-user-name">Laboratory Administrator</div>
            <div className="header-user-role">Admin access</div>
          </div>
        </div>
      </div>
    </header>
  )
}
