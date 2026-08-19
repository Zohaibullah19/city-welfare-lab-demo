import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState'
import { getPatients, getOrdersForPatient } from '../../services/storage'
import { formatDate } from '../../utils/format'
import { useAppData } from '../../context/AppDataContext'

export default function PatientsList() {
  useAppData()
  const [search, setSearch] = useState('')
  const patients = getPatients()

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q)
    )
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h2>All Patients</h2>
          <p className="subtitle">{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div className="page-actions">
          <Link to="/patients/register" className="btn btn-primary">＋ Register Patient</Link>
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 8 }}>
          <div className="search-input-wrap" style={{ maxWidth: 380 }}>
            <span className="search-icon">⌕</span>
            <input placeholder="Search by name, ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="☰"
            title={patients.length === 0 ? 'No patients yet' : 'No matches found'}
            message={patients.length === 0 ? 'Register your first patient to get started.' : 'Try a different search term.'}
            action={patients.length === 0 && <Link to="/patients/register" className="btn btn-primary btn-sm">＋ Register Patient</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Referred By</th>
                  <th>Orders</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="cell-id">{p.id}</td>
                    <td>{p.name} {p.isDemo && <span className="tag-verify" style={{ background: 'var(--blue-100)', color: 'var(--blue-600)' }}>DEMO</span>}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td className="cell-muted">{p.phone || '—'}</td>
                    <td className="cell-muted">{p.referredBy || 'Self'}</td>
                    <td className="cell-muted">{getOrdersForPatient(p.id).length}</td>
                    <td className="cell-muted">{formatDate(p.createdAt)}</td>
                    <td><Link to={`/patients/${p.id}`} className="btn btn-outline btn-sm">Open</Link></td>
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
