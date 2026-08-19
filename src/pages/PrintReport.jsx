import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { getOrder, getPatient, getSettings, getResultsForOrder, getReportForOrder } from '../services/storage'
import { formatDate } from '../utils/format'

const STATUS_COLORS = {
  Normal: '#16A34A', Negative: '#16A34A',
  Abnormal: '#DC2626', High: '#DC2626', Positive: '#DC2626',
  Low: '#D97706', 'Not specified': '#718096'
}

export default function PrintReport() {
  const { orderId } = useParams()
  const order = getOrder(orderId)
  const patient = order ? getPatient(order.patientId) : null
  const settings = getSettings()
  const results = order ? getResultsForOrder(order.id) : null
  const report = order ? getReportForOrder(order.id) : null

  if (!order || !patient) {
    return (
      <div className="page-content">
        <EmptyState icon="!" title="Order not found" message="This test order doesn't exist in demo storage."
          action={<Link to="/orders" className="btn btn-primary btn-sm">Back to Orders</Link>} />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="page-content">
        <EmptyState icon="✎" title="No results entered yet" message="Enter results for this order before generating a report."
          action={<Link to={`/results/${order.id}`} className="btn btn-primary btn-sm">Enter Results</Link>} />
      </div>
    )
  }

  return (
    <div className="print-page-wrap">
      <div className="print-toolbar">
        <div className="flex gap-8">
          <Link to={`/patients/${patient.id}`} className="btn btn-outline">← Back</Link>
          <Link to={`/results/${order.id}`} className="btn btn-outline">Edit Results</Link>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>🖶 Print Report</button>
      </div>

      <div className="a4-sheet">
        <div className="doc-header">
          <img src={settings.logoPath} alt="Lab logo" />
          <div>
            <div className="doc-lab-name">{settings.name}</div>
            <span className="doc-lab-subtitle">{settings.subtitle}</span>
          </div>
        </div>

        <div className="form-grid" style={{ marginBottom: 18, fontSize: 13 }}>
          <MetaRow label="Patient Name" value={patient.name} />
          <MetaRow label="Patient ID" value={patient.id} mono />
          <MetaRow label="Age" value={`${patient.age} yrs`} />
          <MetaRow label="Gender" value={patient.gender} />
          <MetaRow label="Referred By" value={patient.referredBy || 'Self'} />
          <MetaRow label="Report Date" value={formatDate(new Date().toISOString())} />
          <MetaRow label="Report No" value={report?.id || '—'} mono />
        </div>

        <table className="report-results-table">
          <thead>
            <tr><th>Test</th><th>Result</th><th>Unit</th><th>Reference Range</th><th>Status</th></tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.testId}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>{r.result || '—'}</td>
                <td>{r.unit || '—'}</td>
                <td>{r.referenceRange || 'VERIFY WITH LAB'}</td>
                <td>
                  <span
                    className="status-pill-print"
                    style={{
                      color: STATUS_COLORS[r.status] || '#718096',
                      background: `${STATUS_COLORS[r.status] || '#718096'}18`
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="doc-techs-row">
          {settings.technologists.map((t, i) => (
            <div className="doc-tech" key={i}>
              <span className="tech-name">{t.name}</span><br />
              {t.title}<br />
              {t.qualification}<br />
              {t.institute}
            </div>
          ))}
        </div>

        <div className="doc-footer">Address: {settings.address}</div>
      </div>
    </div>
  )
}

function MetaRow({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#718096' }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{ fontWeight: 600 }}>{value}</div>
    </div>
  )
}
