import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { getReports, getPatients, getOrders } from '../services/storage'
import { formatDate } from '../utils/format'
import { useAppData } from '../context/AppDataContext'

export default function Reports() {
  useAppData()
  const reports = getReports()
  const patients = getPatients()
  const orders = getOrders()
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]))
  const orderMap = Object.fromEntries(orders.map(o => [o.id, o]))

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p className="subtitle">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
        </div>
      </div>

      <div className="card">
        {reports.length === 0 ? (
          <EmptyState icon="▦" title="No reports yet" message="Generate a report from the Results page once tests are entered." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Report No</th><th>Patient</th><th>Date</th><th>Tests</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {reports.map(r => {
                  const p = patientMap[r.patientId]
                  const o = orderMap[r.orderId]
                  return (
                    <tr key={r.id}>
                      <td className="cell-id">{r.id}</td>
                      <td>{p?.name || 'Unknown'}</td>
                      <td className="cell-muted">{formatDate(r.createdAt)}</td>
                      <td className="cell-muted">{o ? o.tests.map(t => t.name).join(', ') : '—'}</td>
                      <td><span className="badge badge-green"><span className="badge-dot" />Finalized</span></td>
                      <td>
                        <div className="row-actions">
                          <Link to={`/print/report/${r.orderId}`} className="btn btn-ghost btn-sm">View</Link>
                          <Link to={`/print/report/${r.orderId}`} className="btn btn-ghost btn-sm">Print</Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
