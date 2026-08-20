import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import {
  getOrder,
  getPatient,
  getSettings,
  getResultsForOrder,
  getReportForOrder
} from '../services/storage'
import { formatDate } from '../utils/format'

const STATUS_COLORS = {
  Normal: '#16A34A',
  Negative: '#16A34A',
  Abnormal: '#DC2626',
  High: '#DC2626',
  Positive: '#DC2626',
  Low: '#D97706',
  'Not specified': '#718096'
}

export default function PrintReport() {
  const { orderId } = useParams()

  const order = getOrder(orderId)
  const patient = order ? getPatient(order.patientId) : null
  const settings = getSettings()
  const results = order ? getResultsForOrder(order.id) : null
  const report = order ? getReportForOrder(order.id) : null

  useEffect(() => {
    const previousTitle = document.title

    document.title = ''

    return () => {
      document.title = previousTitle
    }
  }, [])

  if (!order || !patient) {
    return (
      <div className="page-content">
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
      </div>
    )
  }

  if (!results) {
    return (
      <div className="page-content">
        <EmptyState
          icon="✎"
          title="No results entered yet"
          message="Enter results for this order before generating a report."
          action={
            <Link
              to={`/results/${order.id}`}
              className="btn btn-primary btn-sm"
            >
              Enter Results
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="print-page-wrap">

      {/* =====================================================
          SCREEN TOOLBAR
      ====================================================== */}
      <div className="print-toolbar">

        <div className="flex gap-8">

          <Link
            to={`/patients/${patient.id}`}
            className="btn btn-outline"
          >
            ← Back
          </Link>

          <Link
            to={`/results/${order.id}`}
            className="btn btn-outline"
          >
            Edit Results
          </Link>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          🖶 Print Report
        </button>

      </div>


      {/* =====================================================
          A4 REPORT
      ====================================================== */}
      <div className="a4-sheet">

        {/* =================================================
            HEADER
        ================================================== */}
        <div className="doc-header">

          <img
            src={settings.logoPath}
            alt="Lab logo"
          />

          <div>

            <div className="doc-lab-name">
              {settings.name}
            </div>

            {/* Subtitle intentionally removed */}

          </div>

        </div>


        {/* =================================================
            PATIENT INFORMATION
        ================================================== */}
        <div
          className="report-patient-info"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 55,
            rowGap: 12,
            marginBottom: 22,
            fontSize: 13
          }}
        >

          <MetaRow
            label="Patient Name"
            value={patient.name}
          />

          <MetaRow
            label="Age"
            value={`${patient.age} Years`}
          />

          <MetaRow
            label="Patient ID"
            value={patient.id}
            mono
          />

          <MetaRow
            label="Gender"
            value={patient.gender}
          />

          <MetaRow
            label="Referred By"
            value={patient.referredBy || 'Self'}
          />

          <MetaRow
            label="Report Date"
            value={formatDate(new Date().toISOString())}
          />

          <MetaRow
            label="Report No"
            value={report?.id || '—'}
            mono
          />

        </div>


        {/* =================================================
            RESULTS
        ================================================== */}
        <table className="report-results-table">

          <thead>
            <tr>
              <th>Test</th>
              <th>Result</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {results.map((r) => {

              const statusColor =
                STATUS_COLORS[r.status] || '#718096'

              return (
                <tr key={r.testId}>

                  <td style={{ fontWeight: 600 }}>
                    {r.name}
                  </td>

                  <td>
                    {r.result || '—'}
                  </td>

                  <td>
                    {r.unit || '—'}
                  </td>

                  <td>
                    {r.referenceRange || 'VERIFY WITH LAB'}
                  </td>

                  <td>
                    <span
                      className="status-pill-print"
                      style={{
                        color: statusColor,
                        background: `${statusColor}18`
                      }}
                    >
                      {r.status}
                    </span>
                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>


        {/* =================================================
            ELECTRONIC VERIFICATION NOTICE
        ================================================== */}
        <div className="report-verification-note">

          <div className="verification-main">
            Electronically Verified report. No Signature required
          </div>

          <div className="verification-sub">
            (For Diagnostic purposes, not valid for Court of Law)
          </div>

        </div>


        {/* =================================================
            TECHNOLOGISTS
        ================================================== */}
        <div className="doc-techs-row">

          <div className="doc-tech">

            <span className="tech-name">
              Bashir Ahmad
            </span>

            <br />

            BS MLT

            <br />

            Laboratory Technologist

            <br />

            Gomal University

            <br />

            D.I. Khan

          </div>


          <div className="doc-tech">

            <span className="tech-name">
              Asad Ullah
            </span>

            <br />

            BS MLT

            <br />

            Laboratory Technologist

            <br />

            Gomal University

            <br />

            D.I. Khan

          </div>

        </div>


        {/* =================================================
            ADDRESS FOOTER REMOVED
        ================================================== */}

      </div>
    </div>
  )
}


/* =========================================================
   PATIENT META ROW
========================================================= */

function MetaRow({ label, value, mono }) {
  return (
    <div
      className="report-meta-row"
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        minWidth: 0
      }}
    >

      <div
        style={{
          fontSize: 10.5,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#718096',
          fontWeight: 500,
          minWidth: 90
        }}
      >
        {label}
      </div>

      <div
        className={mono ? 'mono' : ''}
        style={{
          fontWeight: 600,
          color: '#111827'
        }}
      >
        {value}
      </div>

    </div>
  )
}