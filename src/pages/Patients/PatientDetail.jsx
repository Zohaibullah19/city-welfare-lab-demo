import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import {
  getPatient, getTests, getOrdersForPatient, generateOrderId, saveOrder
} from '../../services/storage'
import { formatCurrency, formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useAppData } from '../../context/AppDataContext'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { refreshAll } = useAppData()

  const patient = getPatient(id)
  const allTests = useMemo(() => getTests().filter(t => t.status !== 'Disabled'), [])
  const previousOrders = getOrdersForPatient(id)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([]) // array of test objects
  const [discount, setDiscount] = useState(0)
  const [paid, setPaid] = useState(0)
  const [paidTouched, setPaidTouched] = useState(false)

  if (!patient) {
    return (
      <EmptyState
        icon="!"
        title="Patient not found"
        message="This patient record doesn't exist in demo storage."
        action={<Link to="/patients" className="btn btn-primary btn-sm">Back to Patients</Link>}
      />
    )
  }

  const filteredTests = allTests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const addTest = (test) => {
    if (selected.some(t => t.id === test.id)) return
    setSelected(s => [...s, test])
  }
  const removeTest = (testId) => setSelected(s => s.filter(t => t.id !== testId))

  const subtotal = selected.reduce((s, t) => s + t.price, 0)
  const discountNum = Number(discount) || 0
  const total = Math.max(subtotal - discountNum, 0)
  const paidNum = paidTouched ? (Number(paid) || 0) : total
  const remaining = Math.max(total - paidNum, 0)
  const paymentStatus = remaining <= 0 && total > 0 ? 'Paid' : paidNum > 0 ? 'Partial' : 'Unpaid'

  const handleSaveOrder = () => {
    if (selected.length === 0) {
      showToast('Select at least one test before saving', 'error')
      return
    }
    const orderId = generateOrderId({ preview: false })
    const order = {
      id: orderId,
      patientId: patient.id,
      tests: selected.map(t => ({ testId: t.id, name: t.name, price: t.price })),
      subtotal,
      discount: discountNum,
      total,
      paid: paidNum,
      remaining,
      paymentStatus,
      status: 'Pending',
      createdAt: new Date().toISOString()
    }
    saveOrder(order)
    refreshAll()
    showToast(`Test order ${orderId} saved`)
    navigate(`/print/request/${orderId}`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{patient.name}</h2>
          <p className="subtitle">
            <span className="mono">{patient.id}</span> · {patient.age} yrs · {patient.gender} · Referred by {patient.referredBy || 'Self'}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/patients" className="btn btn-outline">← All Patients</Link>
        </div>
      </div>

      <div className="card card-pad mt-16">
        <h3 style={{ fontSize: 14, marginBottom: 14 }}>Patient Information</h3>
        <div className="form-grid">
          <InfoField label="Phone Number" value={patient.phone || '—'} />
          <InfoField label="Address" value={patient.address || '—'} />
          <InfoField label="Referred By" value={patient.referredBy || 'Self'} />
          <InfoField label="Registered On" value={formatDate(patient.createdAt)} />
        </div>
      </div>

      {/* TEST SELECTION */}
      <div className="card mt-24">
        <div className="card-header">
          <h3>Select Laboratory Tests</h3>
          <span className="text-sm text-muted">{selected.length} selected</span>
        </div>
        <div className="card-pad" style={{ paddingBottom: 8 }}>
          <div className="search-input-wrap">
            <span className="search-icon">⌕</span>
            <input placeholder="Search tests by name or category..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap" style={{ maxHeight: 320, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Category</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map(t => {
                const isSelected = selected.some(s => s.id === t.id)
                return (
                  <tr key={t.id}>
                    <td>
                      {t.name}
                      {t.needsVerification && <span className="tag-verify" style={{ marginLeft: 8 }}>VERIFY</span>}
                    </td>
                    <td className="cell-muted">{t.category}</td>
                    <td>{formatCurrency(t.price)}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${isSelected ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => (isSelected ? removeTest(t.id) : addTest(t))}
                      >
                        {isSelected ? 'Added ✓' : '+ Add'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredTests.length === 0 && (
                <tr><td colSpan={4} className="cell-muted" style={{ textAlign: 'center', padding: 24 }}>No tests match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED TESTS + PAYMENT */}
      <div className="card mt-24">
        <div className="card-header"><h3>Selected Tests</h3></div>
        {selected.length === 0 ? (
          <EmptyState icon="⚗" title="No tests selected" message="Add tests from the list above to build this order." />
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Test Name</th><th>Price</th><th></th></tr>
                </thead>
                <tbody>
                  {selected.map((t, i) => (
                    <tr key={t.id}>
                      <td className="cell-muted">{i + 1}</td>
                      <td>{t.name}</td>
                      <td>{formatCurrency(t.price)}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => removeTest(t.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-pad" style={{ paddingTop: 18 }}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Discount (Rs.)</label>
                  <input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Paid Amount (Rs.)</label>
                  <input
                    type="number" min="0"
                    value={paidTouched ? paid : total}
                    onChange={e => { setPaidTouched(true); setPaid(e.target.value) }}
                  />
                </div>
              </div>

              <div className="divider" />

              <div className="flex-col gap-8" style={{ maxWidth: 340, marginLeft: 'auto', fontSize: 14 }}>
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Discount</span><span>- {formatCurrency(discountNum)}</span></div>
                <div className="flex justify-between" style={{ fontWeight: 700, fontSize: 16, borderTop: '1px solid var(--gray-200)', paddingTop: 8 }}>
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between"><span className="text-muted">Paid</span><span>{formatCurrency(paidNum)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Remaining</span><span>{formatCurrency(remaining)}</span></div>
                <div className="flex justify-between items-center mt-8">
                  <span className="text-muted">Payment Status</span>
                  <StatusBadge status={paymentStatus} />
                </div>
              </div>

              <div className="divider" />
              <div className="flex gap-12">
                <button className="btn btn-primary" onClick={handleSaveOrder}>Save Order &amp; Print Test Request →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PREVIOUS VISITS */}
      <div className="card mt-24">
        <div className="card-header"><h3>Previous Visits &amp; Orders</h3></div>
        {previousOrders.length === 0 ? (
          <EmptyState icon="▤" title="No previous orders" message="Orders saved for this patient will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Tests</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {previousOrders.map(o => (
                  <tr key={o.id}>
                    <td className="cell-id">{o.id}</td>
                    <td className="cell-muted">{o.tests.map(t => t.name).join(', ')}</td>
                    <td>{formatCurrency(o.total)}</td>
                    <td><StatusBadge status={o.paymentStatus} /></td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="cell-muted">{formatDate(o.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/print/request/${o.id}`} className="btn btn-ghost btn-sm">Print Request</Link>
                        <Link to={`/results/${o.id}`} className="btn btn-ghost btn-sm">Results</Link>
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

function InfoField({ label, value }) {
  return (
    <div className="form-field">
      <label style={{ color: 'var(--gray-500)', fontWeight: 500, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
