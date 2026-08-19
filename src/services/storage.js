// ============================================================================
// STORAGE SERVICE
// The ONLY place in the app that talks to localStorage directly.
// Every other file reads/writes data through the functions exported here.
//
// UPGRADE PATH: when this becomes a real backend, replace the bodies of
// these functions with fetch() calls to a Node/SQLite API. Nothing outside
// this file needs to change, because pages/components only ever call
// getPatients(), savePatient(), etc.
// ============================================================================

import { SEED_TESTS } from '../data/tests'
import { DEFAULT_LAB_INFO } from '../config/labInfo'

const KEYS = {
  patients: 'cwl_patients',
  orders: 'cwl_orders', // a.k.a "visits" — one order = one registration + selected tests
  tests: 'cwl_tests', // test catalog
  results: 'cwl_results', // keyed by orderId
  reports: 'cwl_reports',
  settings: 'cwl_settings',
  counters: 'cwl_counters',
  seeded: 'cwl_seeded_v1'
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.error(`Storage read failed for ${key}`, e)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error(`Storage write failed for ${key}`, e)
    return false
  }
}

// ---------------------------------------------------------------------------
// SEEDING — sample patients/orders so the dashboard isn't empty on first run
// ---------------------------------------------------------------------------
export function ensureSeeded() {
  if (read(KEYS.seeded, false)) return
  write(KEYS.tests, SEED_TESTS)
  write(KEYS.settings, DEFAULT_LAB_INFO)
  write(KEYS.counters, { patient: 0, order: 0, report: 0 })

  const demoPatients = [
    { name: 'Muhammad Ali', age: 35, gender: 'Male', phone: '0300-1234567', address: 'Hayatabad, Peshawar', referredBy: 'Dr. Ahmed', isDemo: true },
    { name: 'Fatima Bibi', age: 28, gender: 'Female', phone: '0333-7654321', address: 'University Town, Peshawar', referredBy: 'Self', isDemo: true },
    { name: 'Ahmad Khan', age: 52, gender: 'Male', phone: '0345-9988776', address: 'Gulberg, Peshawar', referredBy: 'Dr. Sana Malik', isDemo: true }
  ]

  const tests = SEED_TESTS
  const findTest = name => tests.find(t => t.name === name)

  const patients = []
  const orders = []
  const results = {}
  const reports = []
  const today = new Date().toISOString()

  demoPatients.forEach((p, idx) => {
    const patientId = generatePatientId({ preview: false, bumpCounter: true })
    const patient = { id: patientId, ...p, createdAt: today }
    patients.push(patient)

    const selectedTests = idx === 0
      ? [findTest('CBC') || findTest('RBS'), findTest('Lipid Profile'), findTest('LFTs')].filter(Boolean)
      : idx === 1
        ? [findTest('TSH'), findTest('Vitamin D')].filter(Boolean)
        : [findTest('RFTs'), findTest('Uric Acid')].filter(Boolean)

    const subtotal = selectedTests.reduce((s, t) => s + t.price, 0)
    const discount = idx === 0 ? 500 : 0
    const total = subtotal - discount
    const orderId = generateOrderId({ bumpCounter: true })

    const order = {
      id: orderId,
      patientId,
      tests: selectedTests.map(t => ({ testId: t.id, name: t.name, price: t.price })),
      subtotal,
      discount,
      total,
      paid: idx === 2 ? total - 200 : total,
      remaining: idx === 2 ? 200 : 0,
      paymentStatus: idx === 2 ? 'Partial' : 'Paid',
      status: idx === 0 ? 'Reported' : idx === 1 ? 'Results Entered' : 'Pending',
      createdAt: today
    }
    orders.push(order)

    if (idx === 0) {
      results[orderId] = order.tests.map(t => ({
        testId: t.testId,
        name: t.name,
        result: t.name === 'CBC' || t.name === 'RBS' ? '110' : '14.2',
        unit: t.name === 'RBS' ? 'mg/dL' : 'g/dL',
        referenceRange: 'VERIFY WITH LAB',
        status: 'Normal'
      }))
      const reportNo = generateReportId({ bumpCounter: true })
      reports.push({
        id: reportNo,
        orderId,
        patientId,
        createdAt: today
      })
    }
    if (idx === 1) {
      results[orderId] = order.tests.map(t => ({
        testId: t.testId,
        name: t.name,
        result: '',
        unit: '',
        referenceRange: '',
        status: 'Not specified'
      }))
    }
  })

  write(KEYS.patients, patients)
  write(KEYS.orders, orders)
  write(KEYS.results, results)
  write(KEYS.reports, reports)
  write(KEYS.seeded, true)
}

// ---------------------------------------------------------------------------
// ID GENERATORS
// ---------------------------------------------------------------------------
function getCounters() {
  return read(KEYS.counters, { patient: 0, order: 0, report: 0 })
}
function setCounters(c) {
  write(KEYS.counters, c)
}

export function generatePatientId({ preview = false } = {}) {
  const counters = getCounters()
  const next = counters.patient + 1
  if (!preview) {
    counters.patient = next
    setCounters(counters)
  }
  return `CWL-${String(next).padStart(6, '0')}`
}

export function generateOrderId({ preview = false } = {}) {
  const counters = getCounters()
  const next = counters.order + 1
  if (!preview) {
    counters.order = next
    setCounters(counters)
  }
  return `ORD-${String(next).padStart(6, '0')}`
}

export function generateReportId({ preview = false } = {}) {
  const counters = getCounters()
  const next = counters.report + 1
  if (!preview) {
    counters.report = next
    setCounters(counters)
  }
  return `RPT-${String(next).padStart(6, '0')}`
}

// ---------------------------------------------------------------------------
// PATIENTS
// ---------------------------------------------------------------------------
export function getPatients() {
  return read(KEYS.patients, [])
}
export function getPatient(id) {
  return getPatients().find(p => p.id === id) || null
}
export function savePatient(patient) {
  const patients = getPatients()
  patients.unshift(patient)
  write(KEYS.patients, patients)
  return patient
}
export function updatePatient(id, updates) {
  const patients = getPatients().map(p => (p.id === id ? { ...p, ...updates } : p))
  write(KEYS.patients, patients)
}

// ---------------------------------------------------------------------------
// TEST CATALOG
// ---------------------------------------------------------------------------
export function getTests() {
  return read(KEYS.tests, SEED_TESTS)
}
export function saveTest(t) {
  const tests = getTests()
  tests.unshift(t)
  write(KEYS.tests, tests)
}
export function updateTest(id, updates) {
  const tests = getTests().map(t => (t.id === id ? { ...t, ...updates } : t))
  write(KEYS.tests, tests)
}
export function deleteTest(id) {
  write(KEYS.tests, getTests().filter(t => t.id !== id))
}

// ---------------------------------------------------------------------------
// ORDERS (patient registration + selected tests + payment)
// ---------------------------------------------------------------------------
export function getOrders() {
  return read(KEYS.orders, [])
}
export function getOrder(id) {
  return getOrders().find(o => o.id === id) || null
}
export function getOrdersForPatient(patientId) {
  return getOrders().filter(o => o.patientId === patientId)
}
export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  write(KEYS.orders, orders)
  return order
}
export function updateOrder(id, updates) {
  const orders = getOrders().map(o => (o.id === id ? { ...o, ...updates } : o))
  write(KEYS.orders, orders)
}

// ---------------------------------------------------------------------------
// RESULTS — keyed by orderId, one array of {testId, name, result, unit, referenceRange, status}
// ---------------------------------------------------------------------------
export function getResultsMap() {
  return read(KEYS.results, {})
}
export function getResultsForOrder(orderId) {
  const map = getResultsMap()
  return map[orderId] || null
}
export function saveResultsForOrder(orderId, resultsArray) {
  const map = getResultsMap()
  map[orderId] = resultsArray
  write(KEYS.results, map)
}

// ---------------------------------------------------------------------------
// REPORTS
// ---------------------------------------------------------------------------
export function getReports() {
  return read(KEYS.reports, [])
}
export function getReportForOrder(orderId) {
  return getReports().find(r => r.orderId === orderId) || null
}
export function saveReport(report) {
  const reports = getReports()
  reports.unshift(report)
  write(KEYS.reports, reports)
  return report
}

// ---------------------------------------------------------------------------
// SETTINGS
// ---------------------------------------------------------------------------
export function getSettings() {
  return read(KEYS.settings, DEFAULT_LAB_INFO)
}
export function saveSettings(settings) {
  write(KEYS.settings, settings)
}

// ---------------------------------------------------------------------------
// DEMO DATA RESET
// ---------------------------------------------------------------------------
export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  ensureSeeded()
}
