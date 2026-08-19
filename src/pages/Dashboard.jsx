import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { getOrders, getPatients } from '../services/storage'
import { formatCurrency, formatDate } from '../utils/format'
import { useAppData } from '../context/AppDataContext'

function isToday(iso) {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export default function Dashboard() {
  useAppData() // subscribe to refresh ticks
  const patients = getPatients()
  const orders = getOrders()

  const stats = useMemo(() => {
    const todaysOrders = orders.filter(o => isToday(o.createdAt))
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Results Entered')
    const completed = orders.filter(o => o.status === 'Reported')
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.paid || 0), 0)
    return {
      todaysPatients: todaysOrders.length,
      pendingTests: pending.length,
      completedReports: completed.length,
      todaysRevenue
    }
  }, [orders])

  const recent = orders.slice(0, 8).map(o => ({
    order: o,
    patient: patients.find(p => p.id === o.patientId)
  }))

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p className="subtitle">Overview of today&rsquo;s laboratory activity</p>
        </div>
        <div className="page-actions">
          <Link to="/patients/register" className="btn btn-primary">＋ Register Patient</Link>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon="◐" iconClass="icon-blue" label="Today's Patients" value={stats.todaysPatients} />
        <StatCard icon="⏳" iconClass="icon-amber" label="Pending Tests" value={stats.pendingTests} />
        <StatCard icon="✓" iconClass="icon-green" label="Completed Reports" value={stats.completedReports} />
        <StatCard icon="Rs" iconClass="icon-teal" label="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Patients</h3>
          <Link to="/patients" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon="◧"
            title="No patients yet"
            message="Register your first patient to see activity here."
            action={<Link to="/patients/register" className="btn btn-primary btn-sm">＋ Register Patient</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Tests</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(({ order, patient }) => (
                  <tr key={order.id}>
                    <td className="cell-id">{patient?.id || '—'}</td>
                    <td>{patient?.name || 'Unknown patient'}</td>
                    <td>{patient?.age ?? '—'}</td>
                    <td>{patient?.gender ?? '—'}</td>
                    <td className="cell-muted">{order.tests.length} test{order.tests.length !== 1 ? 's' : ''}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td className="cell-muted">{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/patients/${patient?.id}`} className="btn btn-ghost btn-sm">View</Link>
                        <Link to={`/print/request/${order.id}`} className="btn btn-ghost btn-sm">Print</Link>
                        <Link to={`/results/${order.id}`} className="btn btn-ghost btn-sm">Results</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
