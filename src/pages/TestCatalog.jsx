import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { getTests, saveTest, updateTest } from '../services/storage'
import { formatCurrency } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useAppData } from '../context/AppDataContext'

const emptyForm = { name: '', category: '', price: '' }

export default function TestCatalog() {
  const { refreshTick, refreshAll } = useAppData()
  const [search, setSearch] = useState('')
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | null
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const { showToast } = useToast()

  const tests = getTests()
  const filtered = tests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(emptyForm); setModalMode('add') }
  const openEdit = (t) => { setForm({ name: t.name, category: t.category, price: t.price }); setEditingId(t.id); setModalMode('edit') }
  const close = () => { setModalMode(null); setEditingId(null) }

  const handleSave = () => {
    if (!form.name.trim() || !form.category.trim() || form.price === '') {
      showToast('Please fill in all fields', 'error')
      return
    }
    if (modalMode === 'add') {
      saveTest({
        id: `T${Date.now()}`,
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        status: 'Active',
        needsVerification: false,
        note: ''
      })
      showToast('Test added to catalog')
    } else {
      updateTest(editingId, { name: form.name.trim(), category: form.category.trim(), price: Number(form.price) })
      showToast('Test updated')
    }
    refreshAll()
    close()
  }

  const toggleStatus = (t) => {
    updateTest(t.id, { status: t.status === 'Active' ? 'Disabled' : 'Active' })
    refreshAll()
    showToast(t.status === 'Active' ? `${t.name} disabled` : `${t.name} enabled`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Test Catalog</h2>
          <p className="subtitle">{tests.length} tests · prices seeded from client price list</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}>＋ Add Test</button>
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 8 }}>
          <div className="search-input-wrap" style={{ maxWidth: 380 }}>
            <span className="search-icon">⌕</span>
            <input placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="⚗" title="No tests found" message="Try a different search, or add a new test." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Test Name</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td>
                      {t.name}
                      {t.needsVerification && <span className="tag-verify" style={{ marginLeft: 8 }} title={t.note}>VERIFY</span>}
                    </td>
                    <td className="cell-muted">{t.category}</td>
                    <td>{formatCurrency(t.price)}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(t)}>
                          {t.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalMode && (
        <Modal
          title={modalMode === 'add' ? 'Add Test' : 'Edit Test'}
          onClose={close}
          footer={
            <>
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Test</button>
            </>
          }
        >
          <div className="flex-col gap-12">
            <div className="form-field">
              <label>Test Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CBC" />
            </div>
            <div className="form-field">
              <label>Category</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Hematology" />
            </div>
            <div className="form-field">
              <label>Price (Rs.)</label>
              <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
