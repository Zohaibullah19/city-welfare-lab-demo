import { useEffect, useMemo, useState } from 'react'

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
  getReportForOrder
} from '../services/storage'

import { formatDate } from '../utils/format'

import { useToast } from '../context/ToastContext'

import { useAppData } from '../context/AppDataContext'



// ============================================================================
// RESULT STATUS OPTIONS
// ============================================================================

const RESULT_STATUS_OPTIONS = [
  'Not specified',
  'Normal',
  'Abnormal',
  'High',
  'Low',
  'Positive',
  'Negative'
]



// ============================================================================
// REFERENCE PROFILE OPTIONS
// ============================================================================

const REFERENCE_PROFILES = [
  {
    value: 'Auto',
    label: 'Auto'
  },
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
  },
  {
    value: 'Other',
    label: 'Other / Lab Specific'
  }
]



// ============================================================================
// LABORATORY MASTER TEST LIST
// ============================================================================

const LAB_TEST_MASTER = [

  // --------------------------------------------------------------------------
  // LIPID PROFILE
  // --------------------------------------------------------------------------

  {
    category: 'Lipid Profile',
    parameter: 'Total Cholesterol',
    aliases: [
      'Cholesterol',
      'Total Cholesterol'
    ],
    unit: 'mg/dL',
    normalRange: '0–200',
    labSpecific: false
  },

  {
    category: 'Lipid Profile',
    parameter: 'Triglycerides',
    aliases: [
      'Triglycerides',
      'Triglycerides (TG)',
      'TG'
    ],
    unit: 'mg/dL',
    normalRange: '0–150',
    labSpecific: false
  },

  {
    category: 'Lipid Profile',
    parameter: 'HDL',
    aliases: [
      'HDL'
    ],
    unit: 'mg/dL',
    normalRange: '40–60',
    labSpecific: false
  },

  {
    category: 'Lipid Profile',
    parameter: 'LDL',
    aliases: [
      'LDL'
    ],
    unit: 'mg/dL',
    normalRange: '0–100',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // RFT
  // --------------------------------------------------------------------------

  {
    category: 'RFT',
    parameter: 'Urea',
    aliases: [
      'Urea'
    ],
    unit: 'mg/dL',
    normalRange: '15–45',
    labSpecific: false
  },

  {
    category: 'RFT',
    parameter: 'Creatinine',
    aliases: [
      'Creatinine'
    ],
    unit: 'mg/dL',
    normalRange: '0.6–1.3',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // LFT
  // --------------------------------------------------------------------------

  {
    category: 'LFT',
    parameter: 'ALT / SGPT',
    aliases: [
      'ALT',
      'ALT / SGPT',
      'SGPT'
    ],
    unit: 'U/L',
    normalRange: '4–36',
    labSpecific: false
  },

  {
    category: 'LFT',
    parameter: 'ALP',
    aliases: [
      'ALP',
      'Alkaline Phosphatase'
    ],
    unit: 'U/L',
    normalRange: '20–130',
    labSpecific: false
  },

  {
    category: 'LFT',
    parameter: 'Total Bilirubin',
    aliases: [
      'Total Bilirubin',
      'Bilirubin',
      'SBR'
    ],
    unit: 'mg/dL',
    normalRange: '0.1–1.2',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // ABGs
  // --------------------------------------------------------------------------

  {
    category: 'ABGs',
    parameter: 'pH',
    aliases: [
      'pH'
    ],
    unit: '—',
    normalRange: '7.35–7.45',
    labSpecific: false
  },

  {
    category: 'ABGs',
    parameter: 'PCO₂',
    aliases: [
      'PCO',
      'PCO₂',
      'pCO₂',
      'pCO2',
      'pCO'
    ],
    unit: 'mmHg',
    normalRange: '35–45',
    labSpecific: false
  },

  {
    category: 'ABGs',
    parameter: 'PO₂',
    aliases: [
      'PO',
      'PO₂',
      'pO₂',
      'pO2',
      'pO'
    ],
    unit: 'mmHg',
    normalRange: '80–100',
    labSpecific: false
  },

  {
    category: 'ABGs',
    parameter: 'HCO₃',
    aliases: [
      'HCO₃',
      'HCO3',
      'HCO₃⁻',
      'Bicarbonate'
    ],
    unit: 'mmol/L',
    normalRange: '22–26',
    labSpecific: false
  },

  {
    category: 'ABGs',
    parameter: 'Base Excess / Deficit',
    aliases: [
      'Base Excess / Deficit',
      'Base Excess',
      'Base Deficit'
    ],
    unit: 'mmol/L',
    normalRange: '−2 to +2',
    labSpecific: false
  },

  {
    category: 'ABGs',
    parameter: 'O₂ Saturation',
    aliases: [
      'O₂ Saturation',
      'O2 Saturation',
      'Oxygen Saturation',
      'O Saturation'
    ],
    unit: '%',
    normalRange: '95–100',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // ELECTROLYTES
  // --------------------------------------------------------------------------

  {
    category: 'Electrolytes',
    parameter: 'Sodium (Na⁺)',
    aliases: [
      'Sodium (Na)',
      'Sodium (Na⁺)',
      'Sodium',
      'Na',
      'Na⁺'
    ],
    unit: 'mmol/L',
    normalRange: '135–145',
    labSpecific: false
  },

  {
    category: 'Electrolytes',
    parameter: 'Potassium (K⁺)',
    aliases: [
      'Potassium (K)',
      'Potassium (K⁺)',
      'Potassium',
      'K',
      'K⁺'
    ],
    unit: 'mmol/L',
    normalRange: '3.5–5.2',
    labSpecific: false
  },

  {
    category: 'Electrolytes',
    parameter: 'Chloride (Cl⁻)',
    aliases: [
      'Chloride (Cl)',
      'Chloride (Cl⁻)',
      'Chloride',
      'Cl',
      'Cl⁻'
    ],
    unit: 'mmol/L',
    normalRange: '98–107',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // INFECTIOUS / SEROLOGY
  // --------------------------------------------------------------------------

  {
    category: 'Infectious / Serology',
    parameter: 'Malaria Parasite (MP)',
    aliases: [
      'Malaria Parasite (MP)',
      'Malaria Parasite',
      'MP',
      'Malaria'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Dengue NS1',
    aliases: [
      'Dengue NS1'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Dengue IgG',
    aliases: [
      'Dengue IgG'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Dengue IgM',
    aliases: [
      'Dengue IgM'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Typhoid IgG',
    aliases: [
      'Typhoid IgG'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Typhoid IgM',
    aliases: [
      'Typhoid IgM'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Infectious / Serology',
    parameter: 'Widal TO/TH',
    aliases: [
      'Widal TO/TH',
      'Widal TO/TI',
      'Widal TO',
      'Widal TH',
      'Widal'
    ],
    unit: 'Titer',
    normalRange: 'Lab-specific',
    labSpecific: true
  },

  {
    category: 'Infectious / Serology',
    parameter: 'HBsAg by ELISA',
    aliases: [
      'HBsAg by ELISA',
      'HBs by ELISA',
      'HBsAg'
    ],
    unit: '—',
    normalRange: 'Non-reactive',
    labSpecific: true
  },

  {
    category: 'Infectious / Serology',
    parameter: 'HCV by ELISA',
    aliases: [
      'HCV by ELISA',
      'HCV'
    ],
    unit: '—',
    normalRange: 'Non-reactive',
    labSpecific: true
  },

  {
    category: 'Infectious / Serology',
    parameter: 'HIV by ELISA',
    aliases: [
      'HIV by ELISA',
      'HIV'
    ],
    unit: '—',
    normalRange: 'Non-reactive',
    labSpecific: true
  },



  // --------------------------------------------------------------------------
  // OTHER LABORATORY
  // --------------------------------------------------------------------------

  {
    category: 'Other Laboratory',
    parameter: 'HbA1c',
    aliases: [
      'HbA1c',
      'Hb A1c',
      'Glycated Hemoglobin'
    ],
    unit: '%',
    normalRange: '<5.7',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'Stool R/E',
    aliases: [
      'Stool R/E',
      'Stool RE',
      'Stool Examination'
    ],
    unit: '—',
    normalRange: 'Normal findings',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'Urine Culture / C/S',
    aliases: [
      'Urine Culture',
      'Urine Culture / C/S',
      'Urine C/S'
    ],
    unit: '—',
    normalRange: 'No growth',
    labSpecific: true
  },

  {
    category: 'Other Laboratory',
    parameter: 'Blood Culture / C/S',
    aliases: [
      'Blood Culture',
      'Blood Culture / C/S',
      'Blood C/S'
    ],
    unit: '—',
    normalRange: 'No growth',
    labSpecific: true
  },

  {
    category: 'Other Laboratory',
    parameter: 'PCR',
    aliases: [
      'PCR'
    ],
    unit: '—',
    normalRange: 'Not detected',
    labSpecific: true
  },

  {
    category: 'Other Laboratory',
    parameter: 'Blood Ketones',
    aliases: [
      'Ketone Blood',
      'Blood Ketones',
      'Blood Ketone'
    ],
    unit: 'mmol/L',
    normalRange: '<0.6',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'Urine Ketones',
    aliases: [
      'Ketone Urine',
      'Urine Ketones',
      'Urine Ketone'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'RA Factor / Rheumatoid Factor',
    aliases: [
      'RA Factor',
      'RA Factor / Rheumatoid Factor',
      'Rheumatoid Factor'
    ],
    unit: 'IU/mL',
    normalRange: '<15',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'ASO Titer',
    aliases: [
      'ASO Titer',
      'ASO'
    ],
    unit: 'IU/mL',
    normalRange: '<200',
    labSpecific: false
  },

  {
    category: 'Other Laboratory',
    parameter: 'ANA',
    aliases: [
      'ANA'
    ],
    unit: '—',
    normalRange: 'Negative',
    labSpecific: true
  },

  {
    category: 'Other Laboratory',
    parameter: 'CRP',
    aliases: [
      'CRP',
      'C-Reactive Protein'
    ],
    unit: 'mg/L',
    normalRange: '<3',
    labSpecific: false
  },



  // --------------------------------------------------------------------------
  // CARDIAC
  // --------------------------------------------------------------------------

  {
    category: 'Cardiac',
    parameter: 'Troponin-I',
    aliases: [
      'Troponin-I',
      'Troponin I',
      'Troponin-I (TnI)'
    ],
    unit: 'ng/L',
    normalRange: 'Assay-specific',
    labSpecific: true
  },

  {
    category: 'Cardiac',
    parameter: 'Troponin-T',
    aliases: [
      'Troponin-T',
      'Troponin T',
      'Troponin-T (TnT)'
    ],
    unit: 'ng/L',
    normalRange: 'Assay-specific',
    labSpecific: true
  },

  {
    category: 'Cardiac',
    parameter: 'CK-MB',
    aliases: [
      'CK-MB',
      'CK MB',
      'CKMB'
    ],
    unit: 'ng/mL',
    normalRange: 'Assay-specific',
    labSpecific: true
  },



  // --------------------------------------------------------------------------
  // ADDITIONAL BIOCHEMISTRY
  // --------------------------------------------------------------------------

  {
    category: 'Additional Biochemistry',
    parameter: 'Albumin',
    aliases: [
      'Albumin'
    ],
    unit: 'g/dL',
    normalRange: '3.4–5.4',
    labSpecific: false
  },

  {
    category: 'Additional Biochemistry',
    parameter: 'Total Bilirubin',
    aliases: [
      'Total Bilirubin',
      'Bilirubin Total'
    ],
    unit: 'mg/dL',
    normalRange: '0.1–1.2',
    labSpecific: false
  },

  {
    category: 'Additional Biochemistry',
    parameter: 'Direct Bilirubin',
    aliases: [
      'Direct Bilirubin',
      'Bilirubin Direct'
    ],
    unit: 'mg/dL',
    normalRange: '<0.3',
    labSpecific: false
  },

  {
    category: 'Additional Biochemistry',
    parameter: 'Indirect Bilirubin',
    aliases: [
      'Indirect Bilirubin',
      'Bilirubin Indirect'
    ],
    unit: 'mg/dL',
    normalRange: '0.2–0.9',
    labSpecific: false
  }

]



// ============================================================================
// NORMALIZE PARAMETER NAME
// ============================================================================

function normalizeParameter(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[₂₃₄₅₆₇₈₉₀]/g, '')
    .replace(/⁺|⁻/g, '')
    .replace(/[^a-z0-9]+/g, '')
}



// ============================================================================
// FIND MASTER PARAMETER
// ============================================================================

function findMasterParameter(name) {
  const normalizedName = normalizeParameter(name)

  if (!normalizedName) {
    return null
  }

  const exactMatch = LAB_TEST_MASTER.find(item =>
    item.aliases.some(alias =>
      normalizeParameter(alias) === normalizedName
    )
  )

  if (exactMatch) {
    return exactMatch
  }

  const partialMatch = LAB_TEST_MASTER.find(item =>
    item.aliases.some(alias => {
      const normalizedAlias = normalizeParameter(alias)

      return (
        normalizedName.includes(normalizedAlias) ||
        normalizedAlias.includes(normalizedName)
      )
    })
  )

  return partialMatch || null
}



// ============================================================================
// AUTOMATIC PROFILE
// ============================================================================

function getAutomaticProfile(patient) {
  if (!patient) {
    return 'Adult'
  }

  const age = Number(patient.age)

  if (Number.isFinite(age) && age < 18) {
    return 'Child'
  }

  const gender = String(patient.gender || '').toLowerCase()

  if (
    gender.includes('female') ||
    gender === 'f'
  ) {
    return 'Female'
  }

  if (
    gender.includes('male') ||
    gender === 'm'
  ) {
    return 'Male'
  }

  return 'Adult'
}



// ============================================================================
// REFERENCE DATA
// ============================================================================

function getReferenceData(masterParameter, profile) {
  if (!masterParameter) {
    return {
      unit: '',
      referenceRange: 'Lab-specific / Verify',
      labSpecific: true,
      demographicFallback: false
    }
  }

  if (profile === 'Other') {
    return {
      unit: masterParameter.unit,
      referenceRange: masterParameter.normalRange,
      labSpecific: true,
      demographicFallback: true
    }
  }

  if (
    profile === 'Male' ||
    profile === 'Female' ||
    profile === 'Child'
  ) {
    return {
      unit: masterParameter.unit,
      referenceRange: masterParameter.normalRange,
      labSpecific: true,
      demographicFallback: true
    }
  }

  return {
    unit: masterParameter.unit,
    referenceRange: masterParameter.normalRange,
    labSpecific: !!masterParameter.labSpecific,
    demographicFallback: false
  }
}



// ============================================================================
// PARSE NUMERIC RANGE
// ============================================================================

function parseReferenceRange(range) {
  const value = String(range || '')
    .trim()
    .replace(/−/g, '-')
    .replace(/–/g, '-')

  if (!value) {
    return null
  }

  // 15-45
  const betweenMatch =
    value.match(
      /^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/
    )

  if (betweenMatch) {
    return {
      type: 'between',
      min: Number(betweenMatch[1]),
      max: Number(betweenMatch[2])
    }
  }

  // <5.7
  const lessMatch =
    value.match(
      /^<\s*(-?\d+(?:\.\d+)?)$/
    )

  if (lessMatch) {
    return {
      type: 'less',
      max: Number(lessMatch[1])
    }
  }

  // >5
  const greaterMatch =
    value.match(
      /^>\s*(-?\d+(?:\.\d+)?)$/
    )

  if (greaterMatch) {
    return {
      type: 'greater',
      min: Number(greaterMatch[1])
    }
  }

  // -2 to +2
  const toMatch =
    value.match(
      /^(-?\d+(?:\.\d+)?)\s*to\s*\+?(-?\d+(?:\.\d+)?)$/i
    )

  if (toMatch) {
    return {
      type: 'between',
      min: Number(toMatch[1]),
      max: Number(toMatch[2])
    }
  }

  return null
}



// ============================================================================
// NORMALIZE NUMERIC RESULT
// ============================================================================

function parseNumericResult(result) {
  if (
    result === null ||
    result === undefined ||
    String(result).trim() === ''
  ) {
    return null
  }

  const cleaned =
    String(result)
      .trim()
      .replace(/,/g, '')

  const match =
    cleaned.match(
      /^[-+]?\d+(?:\.\d+)?$/
    )

  if (!match) {
    return null
  }

  const number = Number(cleaned)

  return Number.isFinite(number)
    ? number
    : null
}



// ============================================================================
// AUTOMATIC NUMERIC STATUS
// ============================================================================

function calculateNumericStatus(
  result,
  referenceRange
) {
  const numericResult =
    parseNumericResult(result)

  const parsedRange =
    parseReferenceRange(referenceRange)

  if (
    numericResult === null ||
    !parsedRange
  ) {
    return null
  }

  if (parsedRange.type === 'between') {
    if (numericResult < parsedRange.min) {
      return 'Low'
    }

    if (numericResult > parsedRange.max) {
      return 'High'
    }

    return 'Normal'
  }

  if (parsedRange.type === 'less') {
    return numericResult < parsedRange.max
      ? 'Normal'
      : 'High'
  }

  if (parsedRange.type === 'greater') {
    return numericResult > parsedRange.min
      ? 'Normal'
      : 'Low'
  }

  return null
}



// ============================================================================
// AUTOMATIC TEXT STATUS
// ============================================================================

function calculateTextStatus(
  result,
  referenceRange
) {
  const normalizedResult =
    String(result || '')
      .trim()
      .toLowerCase()

  const normalizedReference =
    String(referenceRange || '')
      .trim()
      .toLowerCase()

  if (!normalizedResult) {
    return null
  }

  if (
    normalizedReference === 'negative' ||
    normalizedReference === 'non-reactive'
  ) {
    if (
      normalizedResult === 'negative' ||
      normalizedResult === 'non-reactive' ||
      normalizedResult === 'not detected'
    ) {
      return 'Negative'
    }

    if (
      normalizedResult === 'positive' ||
      normalizedResult === 'reactive' ||
      normalizedResult === 'detected'
    ) {
      return 'Positive'
    }
  }

  if (
    normalizedReference === 'no growth' &&
    normalizedResult.includes('no growth')
  ) {
    return 'Negative'
  }

  if (
    normalizedReference === 'not detected' &&
    normalizedResult.includes('not detected')
  ) {
    return 'Negative'
  }

  if (
    normalizedReference === 'normal findings' &&
    normalizedResult.includes('normal')
  ) {
    return 'Normal'
  }

  return null
}



// ============================================================================
// DETERMINE RESULT STATUS
// ============================================================================

function determineResultStatus(
  row,
  manualStatus
) {
  if (
    manualStatus &&
    manualStatus !== 'Not specified'
  ) {
    return manualStatus
  }

  const numericStatus =
    calculateNumericStatus(
      row.result,
      row.referenceRange
    )

  if (numericStatus) {
    return numericStatus
  }

  const textStatus =
    calculateTextStatus(
      row.result,
      row.referenceRange
    )

  if (textStatus) {
    return textStatus
  }

  return 'Not specified'
}



// ============================================================================
// BUILD INITIAL ROWS
// ============================================================================

function buildInitialRows(
  order,
  existingResults,
  patient
) {
  if (!order) {
    return []
  }

  // --------------------------------------------------------------------------
  // Existing results
  // --------------------------------------------------------------------------

  if (
    existingResults &&
    existingResults.length > 0
  ) {
    return existingResults.map(
      (row, index) => {
        const masterParameter =
          findMasterParameter(row.name) ||
          findMasterParameter(row.testName)

        const savedProfile =
          row.referenceProfile || 'Auto'

        const profile =
          savedProfile === 'Auto'
            ? getAutomaticProfile(patient)
            : savedProfile

        const referenceData =
          getReferenceData(
            masterParameter,
            profile
          )

        const result =
          row.result || ''

        const status =
          row.status &&
          row.status !== 'Not specified'
            ? row.status
            : determineResultStatus(
                {
                  ...row,
                  result,
                  referenceRange:
                    row.referenceRange ||
                    referenceData.referenceRange
                },
                row.status
              )

        return {
          ...row,

          id:
            row.id ||
            `${row.testId || 'result'}-${index}`,

          referenceProfile:
            savedProfile,

          unit:
            row.unit ||
            referenceData.unit,

          referenceRange:
            row.referenceRange ||
            referenceData.referenceRange,

          status,

          labSpecific:
            row.labSpecific ??
            referenceData.labSpecific,

          demographicFallback:
            row.demographicFallback ??
            referenceData.demographicFallback,

          notes:
            row.notes || ''
        }
      }
    )
  }



  // --------------------------------------------------------------------------
  // Fresh rows
  // --------------------------------------------------------------------------

  const rows = []

  ;(order.tests || []).forEach(
    testInOrder => {
      const masterParameter =
        findMasterParameter(
          testInOrder.name
        )

      if (masterParameter) {
        const referenceData =
          getReferenceData(
            masterParameter,
            'Adult'
          )

        rows.push({
          id:
            `${testInOrder.testId}-0`,

          testId:
            testInOrder.testId,

          testName:
            testInOrder.name,

          name:
            masterParameter.parameter,

          result:
            '',

          unit:
            referenceData.unit,

          referenceRange:
            referenceData.referenceRange,

          status:
            'Not specified',

          referenceProfile:
            'Auto',

          labSpecific:
            referenceData.labSpecific,

          demographicFallback:
            false,

          notes:
            ''
        })

        return
      }

      rows.push({
        id:
          `${testInOrder.testId}-0`,

        testId:
          testInOrder.testId,

        testName:
          testInOrder.name,

        name:
          testInOrder.name,

        result:
          '',

        unit:
          '',

        referenceRange:
          'Lab-specific / Verify',

        status:
          'Not specified',

        referenceProfile:
          'Auto',

        labSpecific:
          true,

        demographicFallback:
          false,

        notes:
          ''
      })
    }
  )

  return rows
}



// ============================================================================
// RESULT STATUS CLASS
// ============================================================================

function getResultStatusClass(status) {
  switch (status) {
    case 'High':
      return 'result-status-high'

    case 'Low':
      return 'result-status-low'

    case 'Abnormal':
      return 'result-status-abnormal'

    case 'Positive':
      return 'result-status-positive'

    case 'Negative':
      return 'result-status-negative'

    case 'Normal':
      return 'result-status-normal'

    default:
      return ''
  }
}



// ============================================================================
// RESULTS LIST
// ============================================================================

export function ResultsList() {
  useAppData()

  const orders =
    getOrders()

  const patients =
    getPatients()

  const patientMap =
    Object.fromEntries(
      patients.map(
        patient => [
          patient.id,
          patient
        ]
      )
    )

  const pending =
    orders.filter(
      order =>
        order.status !== 'Reported'
    )

  return (
    <>

      <div className="page-header">

        <div>

          <h2>
            Results
          </h2>

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

                  <th>
                    Order ID
                  </th>

                  <th>
                    Patient
                  </th>

                  <th>
                    Tests
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>



              <tbody>

                {pending.map(order => {

                  const patient =
                    patientMap[
                      order.patientId
                    ]

                  return (

                    <tr
                      key={order.id}
                    >

                      <td className="cell-id">
                        {order.id}
                      </td>

                      <td>
                        {patient?.name ||
                          'Unknown'}
                      </td>

                      <td className="cell-muted">

                        {(order.tests || [])
                          .map(
                            test =>
                              test.name
                          )
                          .join(', ')}

                      </td>

                      <td>

                        <StatusBadge
                          status={
                            order.status
                          }
                        />

                      </td>

                      <td className="cell-muted">

                        {formatDate(
                          order.createdAt
                        )}

                      </td>

                      <td>

                        <Link
                          to={`/results/${order.id}`}
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



// ============================================================================
// RESULT ENTRY
// ============================================================================

export function ResultEntry() {

  const { orderId } =
    useParams()

  const navigate =
    useNavigate()

  const { showToast } =
    useToast()

  const { refreshAll } =
    useAppData()

  const order =
    getOrder(orderId)

  const patient =
    order
      ? getPatient(
          order.patientId
        )
      : null

  const existing =
    order
      ? getResultsForOrder(
          order.id
        )
      : null

  const [rows, setRows] =
    useState(
      () =>
        buildInitialRows(
          order,
          existing,
          patient
        )
    )

  const [saving, setSaving] =
    useState(false)

  const [generating, setGenerating] =
    useState(false)

  const [showNotes, setShowNotes] =
    useState(false)



  // --------------------------------------------------------------------------
  // Refresh rows if order changes
  // --------------------------------------------------------------------------

  useEffect(() => {

    setRows(
      buildInitialRows(
        order,
        existing,
        patient
      )
    )

  }, [orderId])



  // --------------------------------------------------------------------------
  // Missing order
  // --------------------------------------------------------------------------

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



  // --------------------------------------------------------------------------
  // UPDATE ROW
  // --------------------------------------------------------------------------

  const updateRow =
    (rowId, field, value) => {

      setRows(
        currentRows =>
          currentRows.map(
            row => {

              if (
                row.id !== rowId
              ) {
                return row
              }

              const updated =
                {
                  ...row,
                  [field]: value
                }

              // Automatically determine status
              // when result or reference range changes.

              if (
                field === 'result' ||
                field === 'referenceRange'
              ) {

                const calculatedStatus =
                  determineResultStatus(
                    updated,
                    row.status
                  )

                if (
                  row.status ===
                    'Not specified' ||
                  field ===
                    'referenceRange'
                ) {

                  updated.status =
                    calculatedStatus

                }

              }

              return updated

            }
          )
      )

    }



  // --------------------------------------------------------------------------
  // MANUAL STATUS
  // --------------------------------------------------------------------------

  const updateStatus =
    (rowId, status) => {

      setRows(
        currentRows =>
          currentRows.map(
            row =>
              row.id === rowId
                ? {
                    ...row,
                    status
                  }
                : row
          )
      )

    }



  // --------------------------------------------------------------------------
  // CHANGE REFERENCE PROFILE
  // --------------------------------------------------------------------------

  const changeReferenceProfile =
    (
      rowId,
      selectedProfile
    ) => {

      setRows(
        currentRows =>
          currentRows.map(
            row => {

              if (
                row.id !== rowId
              ) {
                return row
              }

              const masterParameter =
                findMasterParameter(
                  row.name
                ) ||
                findMasterParameter(
                  row.testName
                )

              const actualProfile =
                selectedProfile ===
                  'Auto'
                  ? getAutomaticProfile(
                      patient
                    )
                  : selectedProfile

              const referenceData =
                getReferenceData(
                  masterParameter,
                  actualProfile
                )

              const updatedRow = {

                ...row,

                referenceProfile:
                  selectedProfile,

                unit:
                  referenceData.unit ||
                  row.unit,

                referenceRange:
                  referenceData.referenceRange ||
                  row.referenceRange,

                labSpecific:
                  referenceData.labSpecific,

                demographicFallback:
                  referenceData.demographicFallback

              }

              const calculatedStatus =
                determineResultStatus(
                  updatedRow,
                  'Not specified'
                )

              return {

                ...updatedRow,

                status:
                  row.status ===
                    'Not specified'
                    ? calculatedStatus
                    : row.status

              }

            }
          )
      )

    }



  // --------------------------------------------------------------------------
  // SAVE RESULTS
  // --------------------------------------------------------------------------

  const handleSaveResults =
    () => {

      try {

        setSaving(true)

        saveResultsForOrder(
          order.id,
          rows
        )

        updateOrder(
          order.id,
          {
            status:
              'Results Entered'
          }
        )

        refreshAll()

        showToast(
          'Results saved successfully'
        )

      } catch (error) {

        console.error(
          'Failed to save results:',
          error
        )

        showToast(
          'Failed to save results'
        )

      } finally {

        setSaving(false)

      }

    }



  // --------------------------------------------------------------------------
  // VALIDATE RESULTS
  // --------------------------------------------------------------------------

  const validateResults =
    () => {

      const missingResults =
        rows.filter(
          row =>
            !String(
              row.result || ''
            ).trim()
        )

      if (
        missingResults.length > 0
      ) {

        return {

          valid: false,

          message:
            `Please enter results for ${missingResults.length} parameter(s) before generating the report.`

        }

      }

      return {

        valid: true,
        message: ''

      }

    }



  // --------------------------------------------------------------------------
  // GENERATE REPORT
  // --------------------------------------------------------------------------

  const handleGenerateReport =
    () => {

      const validation =
        validateResults()

      if (!validation.valid) {

        showToast(
          validation.message
        )

        return
      }

      try {

        setGenerating(true)

        saveResultsForOrder(
          order.id,
          rows
        )

        let report =
          getReportForOrder(
            order.id
          )

        if (!report) {

          const reportId =
            generateReportId({
              preview: false
            })

          report =
            saveReport({

              id:
                reportId,

              orderId:
                order.id,

              patientId:
                patient.id,

              createdAt:
                new Date().toISOString()

            })

        }

        updateOrder(
          order.id,
          {
            status:
              'Reported'
          }
        )

        refreshAll()

        showToast(
          `Report ${report.id} generated`
        )

        navigate(
          `/print/report/${order.id}`
        )

      } catch (error) {

        console.error(
          'Failed to generate report:',
          error
        )

        showToast(
          'Failed to generate report'
        )

      } finally {

        setGenerating(false)

      }

    }



  // --------------------------------------------------------------------------
  // GROUP RESULTS
  // --------------------------------------------------------------------------

  const groupedRows =
    useMemo(
      () =>
        rows.reduce(
          (
            groups,
            row
          ) => {

            if (
              !groups[row.testId]
            ) {
              groups[row.testId] =
                []
            }

            groups[
              row.testId
            ].push(row)

            return groups

          },
          {}
        ),
      [rows]
    )



  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------

  const summary =
    useMemo(() => {

      const normal =
        rows.filter(
          row =>
            row.status ===
            'Normal'
        ).length

      const high =
        rows.filter(
          row =>
            row.status ===
            'High'
        ).length

      const low =
        rows.filter(
          row =>
            row.status ===
            'Low'
        ).length

      const positive =
        rows.filter(
          row =>
            row.status ===
            'Positive'
        ).length

      const abnormal =
        rows.filter(
          row =>
            row.status ===
            'Abnormal'
        ).length

      const completed =
        rows.filter(
          row =>
            String(
              row.result || ''
            ).trim() !== ''
        ).length

      return {

        total: rows.length,

        completed,

        normal,

        high,

        low,

        positive,

        abnormal

      }

    }, [rows])



  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (

    <>

      {/* ======================================================================
          HEADER
      ======================================================================= */}

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



      {/* ======================================================================
          PATIENT INFORMATION
      ======================================================================= */}

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
            label="Reference Profile"
            value={getAutomaticProfile(
              patient
            )}
          />

          <InfoField
            label="Referred By"
            value={
              patient.referredBy ||
              'Self'
            }
          />

        </div>

      </div>



      {/* ======================================================================
          RESULT SUMMARY
      ======================================================================= */}

      <div className="result-summary-grid">

        <SummaryCard
          label="Parameters"
          value={summary.total}
        />

        <SummaryCard
          label="Completed"
          value={`${summary.completed}/${summary.total}`}
        />

        <SummaryCard
          label="Normal"
          value={summary.normal}
        />

        <SummaryCard
          label="High"
          value={summary.high}
        />

        <SummaryCard
          label="Low"
          value={summary.low}
        />

        <SummaryCard
          label="Positive"
          value={summary.positive}
        />

      </div>



      {/* ======================================================================
          RESULTS
      ======================================================================= */}

      <div className="card mt-24">

        <div className="card-header">

          <div>

            <h3>
              Test Results
            </h3>

            <p
              className="text-sm text-muted"
              style={{
                marginTop: 4
              }}
            >
              Units and reference ranges are loaded from the laboratory
              master list. Numeric results can be automatically classified.
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() =>
              setShowNotes(
                current => !current
              )
            }
          >
            {showNotes
              ? 'Hide Notes'
              : 'Show Notes'}
          </button>

        </div>



        <div className="table-wrap">

          <table className="data-table">

            <thead>

              <tr>

                <th
                  style={{
                    width: '18%'
                  }}
                >
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
                  Normal Range
                </th>

                <th>
                  Status
                </th>

                {showNotes && (
                  <th>
                    Notes
                  </th>
                )}

              </tr>

            </thead>



            <tbody>

              {Object.entries(
                groupedRows
              ).map(
                (
                  [
                    testId,
                    testRows
                  ]
                ) => (

                  <TestGroup
                    key={testId}
                    rows={
                      testRows
                    }
                    updateRow={
                      updateRow
                    }
                    updateStatus={
                      updateStatus
                    }
                    changeReferenceProfile={
                      changeReferenceProfile
                    }
                    showNotes={
                      showNotes
                    }
                  />

                )
              )}

            </tbody>

          </table>

        </div>



        {/* ====================================================================
            REFERENCE RANGE NOTICE
        ===================================================================== */}

        <div className="card-pad">

          <div
            style={{
              background:
                'var(--blue-100)',
              border:
                '1px solid var(--gray-200)',
              borderRadius:
                'var(--radius-md)',
              padding:
                '12px 14px',
              marginBottom:
                18
            }}
          >

            <div
              style={{
                fontWeight: 700,
                color:
                  'var(--navy-800)',
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

              The normal ranges shown here come from the supplied
              Laboratory Test Master List and represent commonly-used
              adult ranges. Some tests are assay, kit, analyzer or
              method specific.

              <br />

              Male, Female and Child profiles are available for
              demographic selection, but separate verified
              demographic ranges were not provided in the master list.
              Until your laboratory configures those ranges, the
              supplied master-list range is used as a fallback and the
              row is marked for verification.

            </div>

          </div>



          {/* ================================================================
              ACTIONS
          ================================================================ */}

          <div className="flex gap-12">

            <button
              className="btn btn-outline"
              onClick={
                handleSaveResults
              }
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Results'}
            </button>



            <button
              className="btn btn-primary"
              onClick={
                handleGenerateReport
              }
              disabled={generating}
            >
              {generating
                ? 'Generating...'
                : 'Generate Report →'}
            </button>

          </div>

        </div>

      </div>

    </>

  )
}



// ============================================================================
// TEST GROUP
// ============================================================================

function TestGroup({
  rows,
  updateRow,
  updateStatus,
  changeReferenceProfile,
  showNotes
}) {

  return (

    <>

      {rows.map(
        (
          row,
          index
        ) => {

          const calculatedStatus =
            determineResultStatus(
              row,
              row.status
            )

          const statusClass =
            getResultStatusClass(
              calculatedStatus
            )

          return (

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

              {/* ==============================================================
                  TEST / PARAMETER
              =============================================================== */}

              <td>

                <div
                  style={{
                    fontWeight:
                      index === 0 &&
                      rows.length > 1
                        ? 700
                        : 600
                  }}
                >

                  {index === 0 &&
                  rows.length > 1
                    ? row.testName
                    : row.name}

                </div>



                {rows.length > 1 &&
                  index === 0 && (

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
                      color:
                        'var(--amber-600)',
                      fontWeight: 600
                    }}
                  >
                    Lab / Method Specific
                  </div>

                )}



                {row.demographicFallback && (

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 10.5,
                      color:
                        'var(--gray-500)',
                      fontWeight: 500
                    }}
                  >
                    Demographic range: verify with lab
                  </div>

                )}

              </td>



              {/* ==============================================================
                  RESULT
              =============================================================== */}

              <td>

                <input
                  value={
                    row.result || ''
                  }

                  placeholder={
                    row.referenceRange ===
                    'Negative'
                      ? 'e.g. Negative'
                      : row.referenceRange ===
                        'Non-reactive'
                        ? 'e.g. Non-reactive'
                        : 'Enter result'
                  }

                  onChange={
                    event =>
                      updateRow(
                        row.id,
                        'result',
                        event.target.value
                      )
                  }

                  style={{
                    minWidth: 120
                  }}
                />

              </td>



              {/* ==============================================================
                  UNIT
              =============================================================== */}

              <td>

                <input
                  value={
                    row.unit || ''
                  }

                  onChange={
                    event =>
                      updateRow(
                        row.id,
                        'unit',
                        event.target.value
                      )
                  }

                  placeholder="Unit"

                  style={{
                    width: 115
                  }}
                />

              </td>



              {/* ==============================================================
                  REFERENCE PROFILE
              =============================================================== */}

              <td>

                <select
                  value={
                    row.referenceProfile ||
                    'Auto'
                  }

                  onChange={
                    event =>
                      changeReferenceProfile(
                        row.id,
                        event.target.value
                      )
                  }

                  style={{
                    minWidth: 125
                  }}
                >

                  {REFERENCE_PROFILES.map(
                    profile => (

                      <option
                        key={
                          profile.value
                        }
                        value={
                          profile.value
                        }
                      >
                        {profile.label}
                      </option>

                    )
                  )}

                </select>



                {row.referenceProfile ===
                  'Auto' && (

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      color:
                        'var(--gray-500)'
                    }}
                  >
                    Based on patient
                  </div>

                )}

              </td>



              {/* ==============================================================
                  NORMAL RANGE
              =============================================================== */}

              <td>

                <input
                  value={
                    row.referenceRange ||
                    ''
                  }

                  onChange={
                    event =>
                      updateRow(
                        row.id,
                        'referenceRange',
                        event.target.value
                      )
                  }

                  placeholder="Reference range"

                  style={{
                    minWidth: 135
                  }}
                />



                {row.demographicFallback && (

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      color:
                        'var(--gray-500)'
                    }}
                  >
                    Master-list range shown
                  </div>

                )}

              </td>



              {/* ==============================================================
                  STATUS
              =============================================================== */}

              <td>

                <select
                  value={
                    row.status ||
                    'Not specified'
                  }

                  onChange={
                    event =>
                      updateStatus(
                        row.id,
                        event.target.value
                      )
                  }

                  className={
                    statusClass
                  }

                  style={{
                    minWidth: 115
                  }}
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



                {row.result &&
                  row.status ===
                    'Not specified' && (

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 9.5,
                      color:
                        'var(--gray-500)'
                    }}
                  >
                    Enter or select status
                  </div>

                )}

              </td>



              {/* ==============================================================
                  NOTES
              =============================================================== */}

              {showNotes && (

                <td>

                  <textarea
                    value={
                      row.notes || ''
                    }

                    onChange={
                      event =>
                        updateRow(
                          row.id,
                          'notes',
                          event.target.value
                        )
                    }

                    placeholder="Optional note"

                    rows={2}

                    style={{
                      minWidth: 160,
                      resize: 'vertical'
                    }}
                  />

                </td>

              )}

            </tr>

          )

        }

      )}

    </>

  )
}



// ============================================================================
// PATIENT INFORMATION FIELD
// ============================================================================

function InfoField({
  label,
  value,
  mono
}) {

  return (

    <div className="form-field">

      <label
        style={{
          color:
            'var(--gray-500)',
          fontWeight: 500,
          fontSize: 11.5,
          textTransform:
            'uppercase',
          letterSpacing:
            '0.04em'
        }}
      >
        {label}
      </label>



      <div
        className={
          mono
            ? 'mono'
            : ''
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



// ============================================================================
// SUMMARY CARD
// ============================================================================

function SummaryCard({
  label,
  value
}) {

  return (

    <div
      className="card"
      style={{
        padding: '14px 16px'
      }}
    >

      <div
        style={{
          fontSize: 11,
          color:
            'var(--gray-500)',
          textTransform:
            'uppercase',
          letterSpacing:
            '0.04em',
          fontWeight: 600
        }}
      >
        {label}
      </div>



      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 5,
          color:
            'var(--navy-800)'
        }}
      >
        {value}
      </div>

    </div>

  )
}