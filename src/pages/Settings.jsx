import { useRef, useState } from 'react'
import { getSettings, saveSettings, clearAllData } from '../services/storage'
import { ConfirmDialog } from '../components/Modal'
import { useToast } from '../context/ToastContext'
import { useAppData } from '../context/AppDataContext'

export default function Settings() {
  const { settings, refreshSettings, refreshAll } = useAppData()
  const [form, setForm] = useState(settings)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const fileInputRef = useRef(null)
  const { showToast } = useToast()

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const updateTech = (idx, field, value) => {
    setForm(f => {
      const technologists = [...f.technologists]
      technologists[idx] = { ...technologists[idx], [field]: value }
      return { ...f, technologists }
    })
  }

  const handleSave = () => {
    saveSettings(form)
    refreshSettings()
    showToast('Laboratory settings saved')
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const updated = { ...form, logoPath: dataUrl }
      setForm(updated)
      saveSettings(updated)
      refreshSettings()
      showToast('Logo updated')
    }
    reader.readAsDataURL(file)
  }

  const handleClearData = () => {
    clearAllData()
    refreshAll()
    refreshSettings()
    setShowClearConfirm(false)
    showToast('Demo data cleared and reseeded')
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="subtitle">Laboratory identity, branding, and demo data controls</p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 780 }}>
        <h3 style={{ fontSize: 15, marginBottom: 4 }}>Laboratory Information</h3>
        <p className="text-sm text-muted mt-8" style={{ marginBottom: 18 }}>
          These details appear across the sidebar, header, and every printed document.
        </p>

        <div className="form-grid">
          <div className="form-field full">
            <label>Laboratory Name</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Subtitle</label>
            <input value={form.subtitle} onChange={e => update('subtitle', e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Address (Footer)</label>
            <textarea rows={2} value={form.address} onChange={e => update('address', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input value={form.phone} onChange={e => update('phone', e.target.value)} />
            <span className="hint">Placeholder — not visible on the original reference form.</span>
          </div>
          <div className="form-field">
            <label>Logo</label>
            <div className="flex items-center gap-12">
              <img src={form.logoPath} alt="Logo preview" style={{ width: 46, height: 46, border: '1px solid var(--gray-200)', borderRadius: 8, padding: 4 }} />
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>Upload Logo</button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
            </div>
          </div>
        </div>

        <div className="divider" />
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Laboratory Technologists</h3>
        {form.technologists.map((t, idx) => (
          <div className="form-grid mt-8" key={idx} style={{ marginBottom: 14 }}>
            <div className="form-field">
              <label>Name</label>
              <input value={t.name} onChange={e => updateTech(idx, 'name', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Title</label>
              <input value={t.title} onChange={e => updateTech(idx, 'title', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Qualification</label>
              <input value={t.qualification} onChange={e => updateTech(idx, 'qualification', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Institute</label>
              <input value={t.institute} onChange={e => updateTech(idx, 'institute', e.target.value)} />
            </div>
          </div>
        ))}

        <div className="divider" />
        <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
      </div>

      <div className="card card-pad mt-24" style={{ maxWidth: 780, borderColor: 'var(--red-100)' }}>
        <h3 style={{ fontSize: 15, marginBottom: 6, color: 'var(--red-600)' }}>Demo Data</h3>
        <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
          This demo runs entirely on your browser&rsquo;s local storage — nothing is uploaded anywhere.
          Use this to wipe sample patients/orders and start fresh before showing the client.
        </p>
        <button className="btn btn-danger btn-sm" onClick={() => setShowClearConfirm(true)}>Clear Demo Data</button>
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title="Clear all demo data?"
          message="This will permanently delete all patients, orders, results, and reports stored in this browser, and reseed the sample data. This cannot be undone."
          confirmLabel="Yes, clear data"
          danger
          onConfirm={handleClearData}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  )
}
