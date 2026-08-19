import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { getOrders, getPatients } from '../services/storage'
import { formatCurrency, formatDate } from '../utils/format'
import { useAppData } from '../context/AppDataContext'

const FILTERS = ['All', 'Pending', 'Results Entered', 'Reported']

export default function TestOrders() {
  useAppData()
  const [filter, setFilter] = useState('All')
  const orders = getOrders()
  const patients = getPatients()
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]))

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Test Orders</h2>
          <p className="subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      <div className="flex gap-8 mt-8" style={{ marginBottom: 18 }}>
        {FILTERS.map(f => (
          <button key={f} className={`pill-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon="▤" title="No orders found" message="Orders you save from a patient's page will show up here." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Patient</th><th>Tests</th><th>Total</th>
                  <th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const p = patientMap[o.patientId]
                  return (
                    <tr key={o.id}>
                      <td className="cell-id">{o.id}</td>
                      <td>{p ? <Link to={`/patients/${p.id}`}>{p.name}</Link> : 'Unknown'}</td>
                      <td className="cell-muted">{o.tests.length} test{o.tests.length !== 1 ? 's' : ''}</td>
                      <td>{formatCurrency(o.total)}</td>
                      <td><StatusBadge status={o.paymentStatus} /></td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="cell-muted">{formatDate(o.createdAt)}</td>
                      <td>
                        <div className="row-actions">
                          <Link to={`/print/request/${o.id}`} className="btn btn-ghost btn-sm">Print Request</Link>
                          <Link to={`/results/${o.id}`} className="btn btn-ghost btn-sm">
                            {o.status === 'Pending' ? 'Enter Results' : 'View Results'}
                          </Link>
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
