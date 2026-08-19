import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { getOrder, getPatient, getSettings } from '../services/storage'
import { formatDate } from '../utils/format'

export default function PrintTestRequest() {
  const { orderId } = useParams()
  const order = getOrder(orderId)
  const patient = order ? getPatient(order.patientId) : null
  const settings = getSettings()

  if (!order || !patient) {
    return (
      <div className="page-content">
        <EmptyState icon="!" title="Order not found" message="This test order doesn't exist in demo storage."
          action={<Link to="/orders" className="btn btn-primary btn-sm">Back to Orders</Link>} />
      </div>
    )
  }

  return (
    <div className="print-page-wrap">
      <div className="print-toolbar">
        <Link to={`/patients/${patient.id}`} className="btn btn-outline">← Back</Link>
        <button className="btn btn-primary" onClick={() => window.print()}>🖶 Print Test Request</button>
      </div>

      <div className="a4-sheet">
        <div className="doc-header">
          <img src={settings.logoPath} alt="Lab logo" />
          <div>
            <div className="doc-lab-name">{settings.name}</div>
            <span className="doc-lab-subtitle">{settings.subtitle}</span>
          </div>
        </div>

        <div className="doc-meta-row">
          <div className="meta-item">
            <div className="meta-label">Patient Name</div>
            <div className="meta-value">{patient.name}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Referred By</div>
            <div className="meta-value">{patient.referredBy || 'Self'}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Date</div>
            <div className="meta-value">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        <div className="doc-section-title">TESTS</div>

        <ol className="doc-test-list">
          {order.tests.map((t, i) => (
            <li key={t.testId}><b>{i + 1}.</b> {t.name}</li>
          ))}
          {/* Pad list visually similar to the original 14-line form when fewer tests are selected */}
        </ol>

        <div className="doc-amount-row">
          <div>Amount: <span className="line mono" style={{ marginLeft: 8, paddingLeft: 6 }}>Rs. {order.total.toLocaleString('en-PK')}</span></div>
          <div>Signature: <span className="line" style={{ marginLeft: 8 }}>&nbsp;</span></div>
        </div>

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
