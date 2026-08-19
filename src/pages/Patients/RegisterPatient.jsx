import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generatePatientId, savePatient } from '../../services/storage'
import { useToast } from '../../context/ToastContext'
import { useAppData } from '../../context/AppDataContext'

const emptyForm = {
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
  address: '',
  referredBy: '',
  date: new Date().toISOString().slice(0, 10)
}

export default function RegisterPatient() {
  const [form, setForm] = useState(emptyForm)
  const [previewId] = useState(() => generatePatientId({ preview: true }))
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { refreshAll } = useAppData()

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Patient name is required'
    if (!form.age || Number(form.age) <= 0) e.age = 'Enter a valid age'
    if (!form.gender) e.gender = 'Select a gender'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) {
      showToast('Please fix the highlighted fields', 'error')
      return
    }
    const id = generatePatientId({ preview: false })
    const patient = {
      id,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      address: form.address.trim(),
      referredBy: form.referredBy.trim() || 'Self',
      createdAt: new Date(form.date).toISOString(),
      isDemo: false
    }
    savePatient(patient)
    refreshAll()
    showToast(`Patient ${id} registered successfully`)
    navigate(`/patients/${id}`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Register Patient</h2>
          <p className="subtitle">Enter patient details to begin a new laboratory order</p>
        </div>
      </div>

      <form className="card card-pad" onSubmit={handleSubmit} style={{ maxWidth: 780 }}>
        <div className="form-grid">
          <div className="form-field">
            <label>Patient ID</label>
            <input value={previewId} disabled className="mono" />
            <span className="hint">Automatically generated on save</span>
          </div>
          <div className="form-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => update('date', e.target.value)} />
          </div>

          <div className="form-field full">
            <label>Patient Name *</label>
            <input
              placeholder="e.g. Muhammad Ali"
              value={form.name}
              onChange={e => update('name', e.target.value)}
            />
            {errors.name && <span className="hint" style={{ color: 'var(--red-600)' }}>{errors.name}</span>}
          </div>

          <div className="form-field">
            <label>Age *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 35"
              value={form.age}
              onChange={e => update('age', e.target.value)}
            />
            {errors.age && <span className="hint" style={{ color: 'var(--red-600)' }}>{errors.age}</span>}
          </div>
          <div className="form-field">
            <label>Gender *</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-field">
            <label>Phone Number</label>
            <input
              placeholder="e.g. 0300-1234567"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Referred By</label>
            <input
              placeholder="e.g. Dr. Ahmed / Self"
              value={form.referredBy}
              onChange={e => update('referredBy', e.target.value)}
            />
          </div>

          <div className="form-field full">
            <label>Address</label>
            <textarea
              rows={2}
              placeholder="Street, area, city"
              value={form.address}
              onChange={e => update('address', e.target.value)}
            />
          </div>
        </div>

        <div className="divider" />
        <div className="flex gap-12">
          <button type="submit" className="btn btn-primary">Save &amp; Select Tests →</button>
          <button type="button" className="btn btn-outline" onClick={() => setForm(emptyForm)}>Clear Form</button>
        </div>
      </form>
    </>
  )
}
