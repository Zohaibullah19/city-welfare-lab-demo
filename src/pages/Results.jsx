import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

import {
  getOrders,
  getPatients,
  getPatient,
  getOrder,
  getResultsForOrder,
  saveResultsForOrder,
  updateOrder,
  generateReportId,
  saveReport,
  getReportForOrder,
  getTests
} from '../services/storage'

import { formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useAppData } from '../context/AppDataContext'

const RESULT_STATUS_OPTIONS = [
  'Not specified',
  'Normal',
  'Abnormal',
  'High',
  'Low',
  'Positive',
  'Negative'
]

// ---------------------------------------------------------------------------
// REFERENCE PROFILE
//
// The uploaded laboratory master list supplies commonly-used adult ranges.
// It does not provide separate verified male/female/children ranges for the
// listed parameters.
//
// Therefore:
// - Adult uses the supplied master-list reference range.
// - Male/Female/Child remain available as profiles.
// - If a demographic-specific verified range is not available, the UI keeps
//   the supplied range and marks it as "Lab-specific / verify" where needed.
// ---------------------------------------------------------------------------

const REFERENCE_PROFILES = [
  {
    value: 'Adult',
    label: 'Adult'
  },
  {
    value: 'Male',
    label: 'Male'
  },
  {
    value: 'Female',
    label: 'Female'
  },
  {
    value: 'Child',
    label: 'Child'
  }
]

// ---------------------------------------------------------------------------
// Find catalog test
// ---------------------------------------------------------------------------

function getCatalogTest(testId, testName) {
  const tests = getTests()

  return (
    tests.find(t => t.id === testId) ||
    tests.find(t => t.name === testName) ||
    null
  )
}

// ---------------------------------------------------------------------------
// Create result rows from order tests + catalog components
// ---------------------------------------------------------------------------

function buildInitialRows(order, existingResults) {
  if (!order) return []

  if (existingResults && existingResults.length > 0) {
    return existingResults
  }

  const rows = []

  order.tests.forEach(testInOrder => {
    const catalogTest = getCatalogTest(
      testInOrder.testId,
      testInOrder.name
    )

    const components = catalogTest?.components || []

    // ---------------------------------------------------------------
    // If the catalog contains components, create one row per component.
    // ---------------------------------------------------------------

    if (components.length > 0) {
      components.forEach((component, index) => {
        rows.push({
          id: `${testInOrder.testId}-${index}`,

          testId: testInOrder.testId,

          // Keep parent test name so the report can still identify it.
          testName: testInOrder.name,

          name: component.name,

          result: '',

          unit: component.unit || '',

          referenceRange: component.referenceRange || '',

          status: 'Not specified',

          referenceProfile: 'Adult',

          labSpecific: !!component.labSpecific,

          notes: component.notes || ''
        })
      })
    } else {
      // -------------------------------------------------------------
      // Fallback for tests that have no components configured.
      // -------------------------------------------------------------

      rows.push({
        id: `${testInOrder.testId}-0`,

        testId: testInOrder.testId,

        testName: testInOrder.name,

        name: testInOrder.name,

        result: '',

        unit: '',

        referenceRange: 'Lab-specific / Verify',

        status: 'Not specified',

        referenceProfile: 'Adult',

        labSpecific: true,

        notes: ''
      })
    }
  })

  return rows
}

// ---------------------------------------------------------------------------
// LIST VIEW — /results
// ---------------------------------------------------------------------------

export function ResultsList() {
  useAppData()

  const orders = getOrders()
  const patients = getPatients()

  const patientMap = Object.fromEntries(
    patients.map(p => [p.id, p])
  )

  const pending = orders.filter(
    o => o.status !== 'Reported'
  )

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Results</h2>

          <p className="subtitle">
            Orders awaiting or with in-progress results entry
          </p>
        </div>
      </div>

      <div className="card">

        {pending.length === 0 ? (

          <EmptyState
            icon="✎"
            title="Nothing pending"
            message="All orders have been reported, or no orders exist yet."
          />

        ) : (

          <div className="table-wrap">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Patient</th>
                  <th>Tests</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {pending.map(o => {

                  const p = patientMap[o.patientId]

                  return (
                    <tr key={o.id}>

                      <td className="cell-id">
                        {o.id}
                      </td>

                      <td>
                        {p?.name || 'Unknown'}
                      </td>

                      <td className="cell-muted">
                        {o.tests
                          .map(t => t.name)
                          .join(', ')}
                      </td>

                      <td>
                        <StatusBadge status={o.status} />
                      </td>

                      <td className="cell-muted">
                        {formatDate(o.createdAt)}
                      </td>

                      <td>
                        <Link
                          to={`/results/${o.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Enter Results
                        </Link>
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

// ---------------------------------------------------------------------------
// ENTRY VIEW — /results/:orderId
// ---------------------------------------------------------------------------

export function ResultEntry() {

  const { orderId } = useParams()

  const navigate = useNavigate()

  const { showToast } = useToast()

  const { refreshAll } = useAppData()

  const order = getOrder(orderId)

  const patient = order
    ? getPatient(order.patientId)
    : null

  const existing = order
    ? getResultsForOrder(order.id)
    : null

  const [rows, setRows] = useState(
    buildInitialRows(order, existing)
  )

  if (!order || !patient) {

    return (
      <EmptyState
        icon="!"
        title="Order not found"
        message="This test order doesn't exist in demo storage."
        action={
          <Link
            to="/orders"
            className="btn btn-primary btn-sm"
          >
            Back to Orders
          </Link>
        }
      />
    )
  }

  // -------------------------------------------------------------------------
  // Update result row
  // -------------------------------------------------------------------------

  const updateRow = (rowId, field, value) => {

    setRows(currentRows =>
      currentRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              [field]: value
            }
          : row
      )
    )
  }

  // -------------------------------------------------------------------------
  // Change reference profile
  // -------------------------------------------------------------------------

  const changeReferenceProfile = (rowId, profile) => {

    setRows(currentRows =>
      currentRows.map(row => {

        if (row.id !== rowId) {
          return row
        }

        // ---------------------------------------------------------------
        // The supplied PDF does not contain demographic-specific ranges.
        // We therefore preserve the catalog value rather than inventing
        // a male/female/child range.
        // ---------------------------------------------------------------

        return {
          ...row,
          referenceProfile: profile
        }

      })
    )
  }

  // -------------------------------------------------------------------------
  // Save Results
  // -------------------------------------------------------------------------

  const handleSaveResults = () => {

    saveResultsForOrder(
      order.id,
      rows
    )

    updateOrder(
      order.id,
      {
        status: 'Results Entered'
      }
    )

    refreshAll()

    showToast('Results saved')
  }

  // -------------------------------------------------------------------------
  // Generate Report
  // -------------------------------------------------------------------------

  const handleGenerateReport = () => {

    saveResultsForOrder(
      order.id,
      rows
    )

    let report = getReportForOrder(
      order.id
    )

    if (!report) {

      const reportId = generateReportId({
        preview: false
      })

      report = saveReport({
        id: reportId,
        orderId: order.id,
        patientId: patient.id,
        createdAt: new Date().toISOString()
      })
    }

    updateOrder(
      order.id,
      {
        status: 'Reported'
      }
    )

    refreshAll()

    showToast(
      `Report ${report.id} generated`
    )

    navigate(
      `/print/report/${order.id}`
    )
  }

  // -------------------------------------------------------------------------
  // Group rows by parent test
  // -------------------------------------------------------------------------

  const groupedRows = rows.reduce(
    (groups, row) => {

      if (!groups[row.testId]) {
        groups[row.testId] = []
      }

      groups[row.testId].push(row)

      return groups
    },
    {}
  )

  return (
    <>
      {/* =====================================================================
          PAGE HEADER
      ====================================================================== */}

      <div className="page-header">

        <div>

          <h2>
            Enter Test Results
          </h2>

          <p className="subtitle">
            Order{' '}
            <span className="mono">
              {order.id}
            </span>
          </p>

        </div>

        <div className="page-actions">

          <Link
            to={`/patients/${patient.id}`}
            className="btn btn-outline"
          >
            ← Patient
          </Link>

        </div>

      </div>


      {/* =====================================================================
          PATIENT INFORMATION
      ====================================================================== */}

      <div className="card card-pad">

        <div className="form-grid">

          <InfoField
            label="Patient"
            value={patient.name}
          />

          <InfoField
            label="Patient ID"
            value={patient.id}
            mono
          />

          <InfoField
            label="Age"
            value={`${patient.age} Years`}
          />

          <InfoField
            label="Gender"
            value={patient.gender}
          />

          <InfoField
            label="Referred By"
            value={patient.referredBy || 'Self'}
          />

        </div>

      </div>


      {/* =====================================================================
          RESULTS
      ====================================================================== */}

      <div className="card mt-24">

        <div className="card-header">

          <div>

            <h3>
              Test Results
            </h3>

            <p
              className="text-sm text-muted"
              style={{ marginTop: 4 }}
            >
              Units and reference ranges are loaded automatically from the
              laboratory test catalog.
            </p>

          </div>

        </div>


        <div className="table-wrap">

          <table className="data-table">

            <thead>

              <tr>

                <th style={{ width: '20%' }}>
                  Test / Parameter
                </th>

                <th>
                  Result
                </th>

                <th>
                  Unit
                </th>

                <th>
                  Reference Profile
                </th>

                <th>
                  Reference Range
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {Object.entries(groupedRows).map(
                ([testId, testRows]) => (

                  <TestGroup
                    key={testId}
                    rows={testRows}
                    updateRow={updateRow}
                    changeReferenceProfile={
                      changeReferenceProfile
                    }
                  />

                )
              )}

            </tbody>

          </table>

        </div>


        {/* ===================================================================
            INFORMATION / ACTIONS
        ==================================================================== */}

        <div className="card-pad">

          <div
            style={{
              background: 'var(--blue-100)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: 18
            }}
          >

            <div
              style={{
                fontWeight: 700,
                color: 'var(--navy-800)',
                fontSize: 13
              }}
            >
              Reference Range Notice
            </div>

            <div
              className="text-sm text-muted"
              style={{
                marginTop: 5,
                lineHeight: 1.5
              }}
            >
              Reference ranges are based on the uploaded laboratory
              master list. The source provides commonly used adult
              ranges and notes that some values are method/analyzer
              dependent. Verify demographic-specific ranges with your
              laboratory before clinical use.
            </div>

          </div>


          <div className="flex gap-12">

            <button
              className="btn btn-outline"
              onClick={handleSaveResults}
            >
              Save Results
            </button>

            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
            >
              Generate Report →
            </button>

          </div>

        </div>

      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// TEST GROUP
// ---------------------------------------------------------------------------

function TestGroup({
  rows,
  updateRow,
  changeReferenceProfile
}) {

  return (
    <>
      {rows.map((row, index) => (

        <tr
          key={row.id}
          style={
            index === 0
              ? {
                  borderTop:
                    '2px solid var(--gray-200)'
                }
              : undefined
          }
        >

          {/* ===============================================================
              TEST / PARAMETER
          ================================================================ */}

          <td>

            <div
              style={{
                fontWeight:
                  index === 0 ? 700 : 600
              }}
            >

              {index === 0 && rows.length > 1
                ? row.testName
                : row.name}

            </div>

            {rows.length > 1 && index === 0 && (
              <div
                className="text-sm text-muted"
                style={{
                  marginTop: 3
                }}
              >
                {row.name}
              </div>
            )}

            {row.labSpecific && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10.5,
                  color: 'var(--amber-600)',
                  fontWeight: 600
                }}
              >
                Lab / Method Specific
              </div>
            )}

          </td>


          {/* ===============================================================
              RESULT
          ================================================================ */}

          <td>

            <input
              value={row.result}
              placeholder={
                row.referenceRange === 'Negative'
                  ? 'e.g. Negative'
                  : row.referenceRange === 'Non-reactive'
                    ? 'e.g. Non-reactive'
                    : 'Enter result'
              }
              onChange={e =>
                updateRow(
                  row.id,
                  'result',
                  e.target.value
                )
              }
              style={{
                minWidth: 140
              }}
            />

          </td>


          {/* ===============================================================
              UNIT
          ================================================================ */}

          <td>

            <input
              value={row.unit}
              onChange={e =>
                updateRow(
                  row.id,
                  'unit',
                  e.target.value
                )
              }
              placeholder="Unit"
              style={{
                width: 105
              }}
            />

          </td>


          {/* ===============================================================
              REFERENCE PROFILE
          ================================================================ */}

          <td>

            <select
              value={
                row.referenceProfile || 'Adult'
              }
              onChange={e =>
                changeReferenceProfile(
                  row.id,
                  e.target.value
                )
              }
              style={{
                minWidth: 115
              }}
            >

              {REFERENCE_PROFILES.map(
                profile => (
                  <option
                    key={profile.value}
                    value={profile.value}
                  >
                    {profile.label}
                  </option>
                )
              )}

            </select>

          </td>


          {/* ===============================================================
              REFERENCE RANGE
          ================================================================ */}

          <td>

            <input
              value={row.referenceRange}
              onChange={e =>
                updateRow(
                  row.id,
                  'referenceRange',
                  e.target.value
                )
              }
              placeholder="Verify with lab"
              style={{
                minWidth: 145
              }}
            />

            {row.referenceProfile &&
              row.referenceProfile !== 'Adult' && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: '10px',
                    color: 'var(--gray-500)'
                  }}
                >
                  Verify {row.referenceProfile.toLowerCase()}{' '}
                  range with lab
                </div>
              )}

          </td>


          {/* ===============================================================
              STATUS
          ================================================================ */}

          <td>

            <select
              value={row.status}
              onChange={e =>
                updateRow(
                  row.id,
                  'status',
                  e.target.value
                )
              }
            >

              {RESULT_STATUS_OPTIONS.map(
                status => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </td>

        </tr>

      ))}

    </>
  )
}

// ---------------------------------------------------------------------------
// PATIENT INFORMATION FIELD
// ---------------------------------------------------------------------------

function InfoField({
  label,
  value,
  mono
}) {

  return (
    <div className="form-field">

      <label
        style={{
          color: 'var(--gray-500)',
          fontWeight: 500,
          fontSize: 11.5,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}
      >
        {label}
      </label>

      <div
        className={
          mono ? 'mono' : ''
        }
        style={{
          fontSize: 13.5,
          fontWeight: 600
        }}
      >
        {value}
      </div>

    </div>
  )
}