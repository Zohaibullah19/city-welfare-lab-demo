import { NavLink } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◧', end: true },
  {
    group: 'Patients',
    items: [
      { to: '/patients', label: 'All Patients', icon: '☰' },
      { to: '/patients/register', label: 'Register Patient', icon: '＋' }
    ]
  },
  { to: '/orders', label: 'Test Orders', icon: '▤' },
  { to: '/catalog', label: 'Test Catalog', icon: '⚗' },
  { to: '/results', label: 'Results', icon: '✎' },
  { to: '/reports', label: 'Reports', icon: '▦' },
  { to: '/settings', label: 'Settings', icon: '⚙' }
]

export default function Sidebar({ open, onNavigate }) {
  const { settings } = useAppData()

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <img src={settings.logoPath} alt="Laboratory logo" />
        <div className="sidebar-brand-text">
          <span className="name-line1">CITY WELFARE</span>
          <span className="name-line2">MEDICAL LABORATORY</span>
        </div>
      </div>

      <nav>
        {NAV.map((entry, i) =>
          entry.group ? (
            <div className="nav-group" key={entry.group}>
              <div className="nav-group-label">{entry.group}</div>
              <div className="nav-sub">
                {entry.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={entry.to}
              to={entry.to}
              end={entry.end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{entry.icon}</span>
              {entry.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        City Welfare LIMS · Demo Build
        <br />
        v0.1 — not for clinical use
      </div>
    </aside>
  )
}
