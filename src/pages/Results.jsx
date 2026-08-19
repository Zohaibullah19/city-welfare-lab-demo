import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import {
  getOrders, getPatients, getPatient, getOrder,
  getResultsForOrder, saveResultsForOrder, updateOrder,
  generateReportId, saveReport, getReportForOrder
} from '../services/storage'
import { formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useAppData } from '../context/AppDataContext'

const RESULT_STATUS_OPTIONS = ['Not specified', 'Normal', 'Abnormal', 'High', 'Low', 'Positive', 'Negative']

// ---------------------------------------------------------------------------
// LIST VIEW — /results
// ---------------------------------------------------------------------------
export function ResultsList() {
  useAppData()
  const orders = getOrders()
  const patients = getPatients()
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]))
  const pending = orders.filter(o => o.status !== 'Reported')

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Results</h2>
          <p className="subtitle">Orders awaiting or with in-progress results entry</p>
        </div>
      </div>

      <div className="card">
        {pending.length === 0 ? (
          <EmptyState icon="✎" title="Nothing pending" message="All orders have been reported, or no orders exist yet." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Patient</th><th>Tests</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pending.map(o => {
                  const p = patientMap[o.patientId]
                  return (
                    <tr key={o.id}>
                      <td className="cell-id">{o.id}</td>
                      <td>{p?.name || 'Unknown'}</td>
                      <td className="cell-muted">{o.tests.map(t => t.name).join(', ')}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="cell-muted">{formatDate(o.createdAt)}</td>
                      <td><Link to={`/results/${o.id}`} className="btn btn-primary btn-sm">Enter Results</Link></td>
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

// ---------------------------------------------------------------------------
// ENTRY VIEW — /results/:orderId
// ---------------------------------------------------------------------------
export function ResultEntry() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { refreshAll } = useAppData()

  const order = getOrder(orderId)
  const patient = order ? getPatient(order.patientId) : null

  const existing = order ? getResultsForOrder(order.id) : null
  const [rows, setRows] = useState(
    existing || (order ? order.tests.map(t => ({ testId: t.testId, name: t.name, result: '', unit: '', referenceRange: '', status: 'Not specified' })) : [])
  )

  if (!order || !patient) {
    return (
      <EmptyState icon="!" title="Order not found" message="This test order doesn't exist in demo storage."
        action={<Link to="/orders" className="btn btn-primary btn-sm">Back to Orders</Link>} />
    )
  }

  const updateRow = (testId, field, value) => {
    setRows(rs => rs.map(r => (r.testId === testId ? { ...r, [field]: value } : r)))
  }

  const handleSaveResults = () => {
    saveResultsForOrder(order.id, rows)
    updateOrder(order.id, { status: 'Results Entered' })
    refreshAll()
    showToast('Results saved')
  }

  const handleGenerateReport = () => {
    saveResultsForOrder(order.id, rows)
    let report = getReportForOrder(order.id)
    if (!report) {
      const reportId = generateReportId({ preview: false })
      report = saveReport({ id: reportId, orderId: order.id, patientId: patient.id, createdAt: new Date().toISOString() })
    }
    updateOrder(order.id, { status: 'Reported' })
    refreshAll()
    showToast(`Report ${report.id} generated`)
    navigate(`/print/report/${order.id}`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Enter Test Results</h2>
          <p className="subtitle">Order <span className="mono">{order.id}</span></p>
        </div>
        <div className="page-actions">
          <Link to={`/patients/${patient.id}`} className="btn btn-outline">← Patient</Link>
        </div>
      </div>

      <div className="card card-pad">
        <div className="form-grid">
          <InfoField label="Patient" value={patient.name} />
          <InfoField label="Patient ID" value={patient.id} mono />
          <InfoField label="Age" value={patient.age} />
          <InfoField label="Gender" value={patient.gender} />
          <InfoField label="Referred By" value={patient.referredBy || 'Self'} />
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-header"><h3>Test Results</h3></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th style={{ width: '20%' }}>Test Name</th><th>Result</th><th>Unit</th><th>Reference Range</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.testId}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td><input value={r.result} placeholder="e.g. 14.2 / Normal / Positive" onChange={e => updateRow(r.testId, 'result', e.target.value)} style={{ minWidth: 160 }} /></td>
                  <td><input value={r.unit} placeholder="e.g. g/dL" onChange={e => updateRow(r.testId, 'unit', e.target.value)} style={{ width: 100 }} /></td>
                  <td><input value={r.referenceRange} placeholder="VERIFY WITH LAB" onChange={e => updateRow(r.testId, 'referenceRange', e.target.value)} style={{ minWidth: 160 }} /></td>
                  <td>
                    <select value={r.status} onChange={e => updateRow(r.testId, 'status', e.target.value)}>
                      {RESULT_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-pad">
          <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
            Reference ranges are not pre-filled — please enter your laboratory&rsquo;s own verified ranges for each analyte.
          </p>
          <div className="flex gap-12">
            <button className="btn btn-outline" onClick={handleSaveResults}>Save Results</button>
            <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report →</button>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoField({ label, value, mono }) {
  return (
    <div className="form-field">
      <label style={{ color: 'var(--gray-500)', fontWeight: 500, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div className={mono ? 'mono' : ''} style={{ fontSize: 13.5, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
