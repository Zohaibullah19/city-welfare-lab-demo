// ============================================================================
// CITY WELFARE MEDICAL LABORATORY
// TEST PARAMETERS / UNITS / REFERENCE RANGES
// ============================================================================
//
// Source:
// LABORATORY TEST MASTER LIST
// 46 tests/items
//
// IMPORTANT:
// - Adult ranges are based on the supplied laboratory master list.
// - Male/Female/Child-specific ranges are NOT invented.
// - When a population-specific range is unavailable, the application uses
//   the configured fallback only when appropriate and marks it lab-specific.
// - Assay-specific tests remain configurable.
// - Always verify reference intervals against the laboratory's analyzer,
//   method, reagent, and current SOP before clinical use.
//
// ============================================================================


// ============================================================================
// BASIC HELPERS
// ============================================================================

/**
 * Create a reference-range configuration object.
 *
 * @param {string} unit
 * @param {string} range
 * @param {object} options
 * @returns {object}
 */
const adult = (unit, range, options = {}) => ({
  unit: unit || '',
  range: range || '',
  labSpecific: Boolean(options.labSpecific),
  note: options.note || ''
})


/**
 * Create population-specific reference-range configuration.
 *
 * Every population is explicitly represented so the UI/application
 * can safely determine whether a specific reference interval exists.
 *
 * @param {object} ranges
 * @returns {object}
 */
const populationRanges = ({
  adultMale = null,
  adultFemale = null,
  childMale = null,
  childFemale = null,
  newborn = null,
  infant = null,
  pregnancy = null,
  other = null
} = {}) => ({
  adultMale,
  adultFemale,
  childMale,
  childFemale,
  newborn,
  infant,
  pregnancy,
  other
})


// ============================================================================
// REFERENCE POPULATIONS
// ============================================================================

export const REFERENCE_POPULATIONS = [
  {
    id: 'adultMale',
    label: 'Adult Male'
  },
  {
    id: 'adultFemale',
    label: 'Adult Female'
  },
  {
    id: 'childMale',
    label: 'Child Male'
  },
  {
    id: 'childFemale',
    label: 'Child Female'
  },
  {
    id: 'newborn',
    label: 'Newborn'
  },
  {
    id: 'infant',
    label: 'Infant'
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy'
  },
  {
    id: 'other',
    label: 'Other / Lab Specific'
  }
]


// ============================================================================
// TEST PARAMETERS
// ============================================================================

export const TEST_PARAMETERS = {

  // ==========================================================================
  // 1–4. LIPID PROFILE
  // ==========================================================================

  'Lipid Profile:Total Cholesterol': {
    testName: 'Total Cholesterol',
    category: 'Lipid Profile',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0–200'),
      adultFemale: adult('mg/dL', '0–200'),

      childMale: adult('mg/dL', '', {
        labSpecific: true,
        note: 'Use laboratory-verified pediatric reference range.'
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true,
        note: 'Use laboratory-verified pediatric reference range.'
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'Lipid Profile:Triglycerides': {
    testName: 'Triglycerides',
    category: 'Lipid Profile',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0–150'),
      adultFemale: adult('mg/dL', '0–150'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'Lipid Profile:HDL': {
    testName: 'HDL',
    category: 'Lipid Profile',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '40–60'),
      adultFemale: adult('mg/dL', '40–60'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'Lipid Profile:LDL': {
    testName: 'LDL',
    category: 'Lipid Profile',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0–100'),
      adultFemale: adult('mg/dL', '0–100'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 5–6. RFT
  // ==========================================================================

  'RFT:Urea': {
    testName: 'Urea',
    category: 'RFT',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '15–45'),
      adultFemale: adult('mg/dL', '15–45'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'RFT:Creatinine': {
    testName: 'Creatinine',
    category: 'RFT',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0.6–1.3'),
      adultFemale: adult('mg/dL', '0.6–1.3'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 7–9. LFT
  // ==========================================================================

  'LFT:ALT / SGPT': {
    testName: 'ALT / SGPT',
    category: 'LFT',

    ranges: populationRanges({
      adultMale: adult('U/L', '4–36'),
      adultFemale: adult('U/L', '4–36'),

      childMale: adult('U/L', '', {
        labSpecific: true
      }),

      childFemale: adult('U/L', '', {
        labSpecific: true
      }),

      newborn: adult('U/L', '', {
        labSpecific: true
      }),

      infant: adult('U/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('U/L', '', {
        labSpecific: true
      }),

      other: adult('U/L', '', {
        labSpecific: true
      })
    })
  },


  'LFT:ALP': {
    testName: 'ALP',
    category: 'LFT',

    ranges: populationRanges({
      adultMale: adult('U/L', '20–130'),
      adultFemale: adult('U/L', '20–130'),

      childMale: adult('U/L', '', {
        labSpecific: true
      }),

      childFemale: adult('U/L', '', {
        labSpecific: true
      }),

      newborn: adult('U/L', '', {
        labSpecific: true
      }),

      infant: adult('U/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('U/L', '', {
        labSpecific: true
      }),

      other: adult('U/L', '', {
        labSpecific: true
      })
    })
  },


  'LFT:Total Bilirubin': {
    testName: 'Total Bilirubin',
    category: 'LFT',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0.1–1.2'),
      adultFemale: adult('mg/dL', '0.1–1.2'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 10–15. ABGs
  // ==========================================================================

  'ABGs:pH': {
    testName: 'pH',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('—', '7.35–7.45'),
      adultFemale: adult('—', '7.35–7.45'),

      childMale: adult('—', '', {
        labSpecific: true
      }),

      childFemale: adult('—', '', {
        labSpecific: true
      }),

      newborn: adult('—', '', {
        labSpecific: true
      }),

      infant: adult('—', '', {
        labSpecific: true
      }),

      pregnancy: adult('—', '', {
        labSpecific: true
      }),

      other: adult('—', '', {
        labSpecific: true
      })
    })
  },


  'ABGs:PCO': {
    testName: 'PCO₂',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('mmHg', '35–45'),
      adultFemale: adult('mmHg', '35–45'),

      childMale: adult('mmHg', '', {
        labSpecific: true
      }),

      childFemale: adult('mmHg', '', {
        labSpecific: true
      }),

      newborn: adult('mmHg', '', {
        labSpecific: true
      }),

      infant: adult('mmHg', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmHg', '', {
        labSpecific: true
      }),

      other: adult('mmHg', '', {
        labSpecific: true
      })
    })
  },


  'ABGs:PO': {
    testName: 'PO₂',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('mmHg', '80–100'),
      adultFemale: adult('mmHg', '80–100'),

      childMale: adult('mmHg', '', {
        labSpecific: true
      }),

      childFemale: adult('mmHg', '', {
        labSpecific: true
      }),

      newborn: adult('mmHg', '', {
        labSpecific: true
      }),

      infant: adult('mmHg', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmHg', '', {
        labSpecific: true
      }),

      other: adult('mmHg', '', {
        labSpecific: true
      })
    })
  },


  'ABGs:HCO': {
    testName: 'HCO₃',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '22–26'),
      adultFemale: adult('mmol/L', '22–26'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  'ABGs:Base Excess / Deficit': {
    testName: 'Base Excess / Deficit',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '−2 to +2'),
      adultFemale: adult('mmol/L', '−2 to +2'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  'ABGs:O Saturation': {
    testName: 'O₂ Saturation',
    category: 'ABGs',

    ranges: populationRanges({
      adultMale: adult('%', '95–100'),
      adultFemale: adult('%', '95–100'),

      childMale: adult('%', '', {
        labSpecific: true
      }),

      childFemale: adult('%', '', {
        labSpecific: true
      }),

      newborn: adult('%', '', {
        labSpecific: true
      }),

      infant: adult('%', '', {
        labSpecific: true
      }),

      pregnancy: adult('%', '', {
        labSpecific: true
      }),

      other: adult('%', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 16–18. ELECTROLYTES
  // ==========================================================================

  'Electrolytes:Sodium (Na)': {
    testName: 'Sodium (Na⁺)',
    category: 'Electrolytes',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '135–145'),
      adultFemale: adult('mmol/L', '135–145'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  'Electrolytes:Potassium (K)': {
    testName: 'Potassium (K⁺)',
    category: 'Electrolytes',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '3.5–5.2'),
      adultFemale: adult('mmol/L', '3.5–5.2'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  'Electrolytes:Chloride (Cl)': {
    testName: 'Chloride (Cl⁻)',
    category: 'Electrolytes',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '98–107'),
      adultFemale: adult('mmol/L', '98–107'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 19–28. INFECTIOUS / SEROLOGY
  // ==========================================================================

  'Infectious / Serology:Malaria Parasite (MP)': {
    testName: 'Malaria Parasite (MP)',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Dengue NS1': {
    testName: 'Dengue NS1',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Dengue IgG': {
    testName: 'Dengue IgG',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Dengue IgM': {
    testName: 'Dengue IgM',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Typhoid IgG': {
    testName: 'Typhoid IgG',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Typhoid IgM': {
    testName: 'Typhoid IgM',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Infectious / Serology:Widal TO/TH': {
    testName: 'Widal TO/TH',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('Titer', 'Lab-specific', {
        labSpecific: true,
        note: 'Reference interpretation depends on laboratory method and local practice.'
      }),

      adultFemale: adult('Titer', 'Lab-specific', {
        labSpecific: true
      }),

      childMale: adult('Titer', 'Lab-specific', {
        labSpecific: true
      }),

      childFemale: adult('Titer', 'Lab-specific', {
        labSpecific: true
      }),

      other: adult('Titer', 'Lab-specific', {
        labSpecific: true
      })
    })
  },


  'Infectious / Serology:HBsAg by ELISA': {
    testName: 'HBsAg by ELISA',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Non-reactive'),
      adultFemale: adult('—', 'Non-reactive'),
      childMale: adult('—', 'Non-reactive'),
      childFemale: adult('—', 'Non-reactive'),
      newborn: adult('—', 'Non-reactive'),
      infant: adult('—', 'Non-reactive'),
      pregnancy: adult('—', 'Non-reactive'),
      other: adult('—', 'Non-reactive')
    })
  },


  'Infectious / Serology:HCV by ELISA': {
    testName: 'HCV by ELISA',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Non-reactive'),
      adultFemale: adult('—', 'Non-reactive'),
      childMale: adult('—', 'Non-reactive'),
      childFemale: adult('—', 'Non-reactive'),
      newborn: adult('—', 'Non-reactive'),
      infant: adult('—', 'Non-reactive'),
      pregnancy: adult('—', 'Non-reactive'),
      other: adult('—', 'Non-reactive')
    })
  },


  'Infectious / Serology:HIV by ELISA': {
    testName: 'HIV by ELISA',
    category: 'Infectious / Serology',

    ranges: populationRanges({
      adultMale: adult('—', 'Non-reactive'),
      adultFemale: adult('—', 'Non-reactive'),
      childMale: adult('—', 'Non-reactive'),
      childFemale: adult('—', 'Non-reactive'),
      newborn: adult('—', 'Non-reactive'),
      infant: adult('—', 'Non-reactive'),
      pregnancy: adult('—', 'Non-reactive'),
      other: adult('—', 'Non-reactive')
    })
  },


  // ==========================================================================
  // 29–39. OTHER LABORATORY
  // ==========================================================================

  'Other Laboratory:HbA1c': {
    testName: 'HbA1c',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('%', '<5.7'),
      adultFemale: adult('%', '<5.7'),

      childMale: adult('%', '', {
        labSpecific: true
      }),

      childFemale: adult('%', '', {
        labSpecific: true
      }),

      newborn: adult('%', '', {
        labSpecific: true
      }),

      infant: adult('%', '', {
        labSpecific: true
      }),

      pregnancy: adult('%', '', {
        labSpecific: true
      }),

      other: adult('%', '', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:Stool R/E': {
    testName: 'Stool R/E',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'Normal findings'),
      adultFemale: adult('—', 'Normal findings'),
      childMale: adult('—', 'Normal findings'),
      childFemale: adult('—', 'Normal findings'),
      newborn: adult('—', 'Normal findings'),
      infant: adult('—', 'Normal findings'),
      pregnancy: adult('—', 'Normal findings'),
      other: adult('—', 'Normal findings')
    })
  },


  'Other Laboratory:Urine Culture / C/S': {
    testName: 'Urine Culture / C/S',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'No growth'),
      adultFemale: adult('—', 'No growth'),
      childMale: adult('—', 'No growth'),
      childFemale: adult('—', 'No growth'),
      newborn: adult('—', 'No growth'),
      infant: adult('—', 'No growth'),
      pregnancy: adult('—', 'No growth'),
      other: adult('—', 'No growth')
    })
  },


  'Other Laboratory:Blood Culture / C/S': {
    testName: 'Blood Culture / C/S',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'No growth'),
      adultFemale: adult('—', 'No growth'),
      childMale: adult('—', 'No growth'),
      childFemale: adult('—', 'No growth'),
      newborn: adult('—', 'No growth'),
      infant: adult('—', 'No growth'),
      pregnancy: adult('—', 'No growth'),
      other: adult('—', 'No growth')
    })
  },


  'Other Laboratory:PCR': {
    testName: 'PCR',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'Not detected', {
        labSpecific: true,
        note: 'Interpretation should be configured according to laboratory assay/method.'
      }),

      adultFemale: adult('—', 'Not detected', {
        labSpecific: true
      }),

      childMale: adult('—', 'Not detected', {
        labSpecific: true
      }),

      childFemale: adult('—', 'Not detected', {
        labSpecific: true
      }),

      other: adult('—', 'Not detected', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:Blood Ketones': {
    testName: 'Blood Ketones',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('mmol/L', '<0.6'),
      adultFemale: adult('mmol/L', '<0.6'),

      childMale: adult('mmol/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mmol/L', '', {
        labSpecific: true
      }),

      newborn: adult('mmol/L', '', {
        labSpecific: true
      }),

      infant: adult('mmol/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mmol/L', '', {
        labSpecific: true
      }),

      other: adult('mmol/L', '', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:Urine Ketones': {
    testName: 'Urine Ketones',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative'),
      adultFemale: adult('—', 'Negative'),
      childMale: adult('—', 'Negative'),
      childFemale: adult('—', 'Negative'),
      newborn: adult('—', 'Negative'),
      infant: adult('—', 'Negative'),
      pregnancy: adult('—', 'Negative'),
      other: adult('—', 'Negative')
    })
  },


  'Other Laboratory:RA Factor / Rheumatoid Factor': {
    testName: 'RA Factor / Rheumatoid Factor',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('IU/mL', '<15'),
      adultFemale: adult('IU/mL', '<15'),

      childMale: adult('IU/mL', '', {
        labSpecific: true
      }),

      childFemale: adult('IU/mL', '', {
        labSpecific: true
      }),

      newborn: adult('IU/mL', '', {
        labSpecific: true
      }),

      infant: adult('IU/mL', '', {
        labSpecific: true
      }),

      pregnancy: adult('IU/mL', '', {
        labSpecific: true
      }),

      other: adult('IU/mL', '', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:ASO Titer': {
    testName: 'ASO Titer',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('IU/mL', '<200'),
      adultFemale: adult('IU/mL', '<200'),

      childMale: adult('IU/mL', '', {
        labSpecific: true
      }),

      childFemale: adult('IU/mL', '', {
        labSpecific: true
      }),

      newborn: adult('IU/mL', '', {
        labSpecific: true
      }),

      infant: adult('IU/mL', '', {
        labSpecific: true
      }),

      pregnancy: adult('IU/mL', '', {
        labSpecific: true
      }),

      other: adult('IU/mL', '', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:ANA': {
    testName: 'ANA',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('—', 'Negative', {
        labSpecific: true
      }),

      adultFemale: adult('—', 'Negative', {
        labSpecific: true
      }),

      childMale: adult('—', 'Negative', {
        labSpecific: true
      }),

      childFemale: adult('—', 'Negative', {
        labSpecific: true
      }),

      other: adult('—', 'Negative', {
        labSpecific: true
      })
    })
  },


  'Other Laboratory:CRP': {
    testName: 'CRP',
    category: 'Other Laboratory',

    ranges: populationRanges({
      adultMale: adult('mg/L', '<3'),
      adultFemale: adult('mg/L', '<3'),

      childMale: adult('mg/L', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/L', '', {
        labSpecific: true
      }),

      newborn: adult('mg/L', '', {
        labSpecific: true
      }),

      infant: adult('mg/L', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/L', '', {
        labSpecific: true
      }),

      other: adult('mg/L', '', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 40–42. CARDIAC
  // ==========================================================================

  'Cardiac:Troponin-I': {
    testName: 'Troponin-I',
    category: 'Cardiac',

    ranges: populationRanges({
      adultMale: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true,
        note: 'Reference limit must be configured according to the laboratory assay/analyzer.'
      }),

      adultFemale: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      childMale: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      childFemale: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      newborn: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      infant: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      pregnancy: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      }),

      other: adult('ng/L or ng/mL', 'Assay-specific', {
        labSpecific: true
      })
    })
  },


  'Cardiac:Troponin-T': {
    testName: 'Troponin-T',
    category: 'Cardiac',

    ranges: populationRanges({
      adultMale: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      adultFemale: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      childMale: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      childFemale: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      newborn: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      infant: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      pregnancy: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      }),

      other: adult('ng/L', 'Assay-specific', {
        labSpecific: true
      })
    })
  },


  'Cardiac:CK-MB': {
    testName: 'CK-MB',
    category: 'Cardiac',

    ranges: populationRanges({
      adultMale: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      adultFemale: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      childMale: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      childFemale: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      newborn: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      infant: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      pregnancy: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      }),

      other: adult('ng/mL or U/L', 'Assay-specific', {
        labSpecific: true
      })
    })
  },


  // ==========================================================================
  // 43–46. ADDITIONAL BIOCHEMISTRY
  // ==========================================================================

  'Additional Biochemistry:Albumin': {
    testName: 'Albumin',
    category: 'Additional Biochemistry',

    ranges: populationRanges({
      adultMale: adult('g/dL', '3.4–5.4'),
      adultFemale: adult('g/dL', '3.4–5.4'),

      childMale: adult('g/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('g/dL', '', {
        labSpecific: true
      }),

      newborn: adult('g/dL', '', {
        labSpecific: true
      }),

      infant: adult('g/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('g/dL', '', {
        labSpecific: true
      }),

      other: adult('g/dL', '', {
        labSpecific: true
      })
    })
  },


  'Additional Biochemistry:Total Bilirubin': {
    testName: 'Total Bilirubin',
    category: 'Additional Biochemistry',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0.1–1.2'),
      adultFemale: adult('mg/dL', '0.1–1.2'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'Additional Biochemistry:Direct Bilirubin': {
    testName: 'Direct Bilirubin',
    category: 'Additional Biochemistry',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '<0.3'),
      adultFemale: adult('mg/dL', '<0.3'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  },


  'Additional Biochemistry:Indirect Bilirubin': {
    testName: 'Indirect Bilirubin',
    category: 'Additional Biochemistry',

    ranges: populationRanges({
      adultMale: adult('mg/dL', '0.2–0.9'),
      adultFemale: adult('mg/dL', '0.2–0.9'),

      childMale: adult('mg/dL', '', {
        labSpecific: true
      }),

      childFemale: adult('mg/dL', '', {
        labSpecific: true
      }),

      newborn: adult('mg/dL', '', {
        labSpecific: true
      }),

      infant: adult('mg/dL', '', {
        labSpecific: true
      }),

      pregnancy: adult('mg/dL', '', {
        labSpecific: true
      }),

      other: adult('mg/dL', '', {
        labSpecific: true
      })
    })
  }
}


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates the lookup key used by TEST_PARAMETERS.
 *
 * @param {string} category
 * @param {string} testName
 * @returns {string}
 */
export function getTestParameterKey(category, testName) {
  return `${category}:${testName}`
}


/**
 * Get the complete parameter configuration for a test.
 *
 * @param {string} category
 * @param {string} testName
 * @returns {object|null}
 */
export function getTestParameter(category, testName) {
  const key = getTestParameterKey(category, testName)

  return TEST_PARAMETERS[key] || null
}


/**
 * Get a reference range based on test and population.
 *
 * IMPORTANT:
 * If the requested population has no supplied range, the function
 * falls back to the adult male configuration ONLY as a temporary
 * laboratory-verification fallback.
 *
 * It does not create or invent a new medical range.
 *
 * @param {string} category
 * @param {string} testName
 * @param {string} population
 * @returns {object}
 */
export function getReferenceRange(
  category,
  testName,
  population = 'adultMale'
) {
  const parameter = getTestParameter(category, testName)

  // Test does not exist.
  if (!parameter) {
    return {
      unit: '',
      range: '',
      labSpecific: true,
      note: 'No parameter configuration found.'
    }
  }

  const selected = parameter.ranges?.[population]

  // Requested population has a configured range.
  if (selected && selected.range) {
    return selected
  }

  // --------------------------------------------------------------------------
  // FALLBACK
  // --------------------------------------------------------------------------
  //
  // Do not invent a population-specific range.
  //
  // If the laboratory has not supplied a range for the requested population,
  // use the adult-male configuration as a clearly marked fallback.
  //
  // This allows the application to continue functioning while making it
  // obvious that the value must be verified by the laboratory.
  // --------------------------------------------------------------------------

  const fallback = parameter.ranges?.adultMale

  if (fallback && fallback.range) {
    return {
      ...fallback,

      labSpecific: true,

      note:
        `Population-specific reference range for "${population}" was not supplied. ` +
        'Verify this range with the laboratory before clinical use.'
    }
  }

  // No usable configuration exists.
  return {
    unit: '',
    range: '',
    labSpecific: true,
    note: 'Laboratory-specific reference range required.'
  }
}


/**
 * Determine a default population from patient age and gender.
 *
 * Current application policy:
 *
 * - Age < 1 year  → Infant
 * - Age 1–17      → Child Male/Female when gender is known
 * - Age >= 18     → Adult Male/Female when gender is known
 * - Unknown gender → Other
 *
 * NOTE:
 * These are application routing rules, NOT clinical reference-range
 * recommendations. The laboratory should configure its final population
 * policy.
 *
 * @param {number|string} age
 * @param {string} gender
 * @returns {string}
 */
export function getDefaultPopulation(age, gender) {
  const numericAge = Number(age)

  const normalizedGender = String(gender || '')
    .trim()
    .toLowerCase()

  const isFemale =
    normalizedGender === 'female' ||
    normalizedGender === 'f'

  const isMale =
    normalizedGender === 'male' ||
    normalizedGender === 'm'

  // --------------------------------------------------------------------------
  // AGE-BASED POPULATION
  // --------------------------------------------------------------------------

  if (
    age !== '' &&
    age !== null &&
    age !== undefined &&
    Number.isFinite(numericAge)
  ) {

    // Infant: under 1 year.
    if (numericAge >= 0 && numericAge < 1) {
      return 'infant'
    }

    // Child: 1–17 years.
    if (numericAge >= 1 && numericAge < 18) {
      if (isFemale) {
        return 'childFemale'
      }

      if (isMale) {
        return 'childMale'
      }

      return 'other'
    }

    // Adult: 18 years and above.
    if (numericAge >= 18) {
      if (isFemale) {
        return 'adultFemale'
      }

      if (isMale) {
        return 'adultMale'
      }

      return 'other'
    }
  }

  // --------------------------------------------------------------------------
  // GENDER-ONLY FALLBACK
  // --------------------------------------------------------------------------

  if (isFemale) {
    return 'adultFemale'
  }

  if (isMale) {
    return 'adultMale'
  }

  return 'other'
}


/**
 * Get the unit for a test.
 *
 * @param {string} category
 * @param {string} testName
 * @param {string} population
 * @returns {string}
 */
export function getTestUnit(
  category,
  testName,
  population = 'adultMale'
) {
  return getReferenceRange(
    category,
    testName,
    population
  ).unit
}


/**
 * Get the displayed reference range for a test.
 *
 * @param {string} category
 * @param {string} testName
 * @param {string} population
 * @returns {string}
 */
export function getTestReferenceRange(
  category,
  testName,
  population = 'adultMale'
) {
  return getReferenceRange(
    category,
    testName,
    population
  ).range
}


/**
 * Check whether the selected reference range is laboratory-specific.
 *
 * @param {string} category
 * @param {string} testName
 * @param {string} population
 * @returns {boolean}
 */
export function isLabSpecificRange(
  category,
  testName,
  population = 'adultMale'
) {
  return getReferenceRange(
    category,
    testName,
    population
  ).labSpecific
}


/**
 * Get the complete reference-range metadata.
 *
 * Useful when the UI needs:
 * - unit
 * - range
 * - lab-specific status
 * - explanatory note
 *
 * @param {string} category
 * @param {string} testName
 * @param {string} population
 * @returns {object}
 */
export function getTestReferenceInfo(
  category,
  testName,
  population = 'adultMale'
) {
  return getReferenceRange(
    category,
    testName,
    population
  )
}


/**
 * Check whether a test exists in the master list.
 *
 * @param {string} category
 * @param {string} testName
 * @returns {boolean}
 */
export function hasTestParameter(category, testName) {
  return Boolean(
    getTestParameter(category, testName)
  )
}


/**
 * Get all configured test parameters as an array.
 *
 * Useful for:
 * - dropdowns
 * - search
 * - admin screens
 * - test management
 *
 * @returns {Array}
 */
export function getAllTestParameters() {
  return Object.entries(TEST_PARAMETERS).map(
    ([key, parameter]) => ({
      key,
      ...parameter
    })
  )
}


/**
 * Get all tests belonging to a category.
 *
 * @param {string} category
 * @returns {Array}
 */
export function getTestsByCategory(category) {
  return getAllTestParameters().filter(
    parameter => parameter.category === category
  )
}


/**
 * Get all available laboratory categories.
 *
 * @returns {Array<string>}
 */
export function getTestCategories() {
  return [
    ...new Set(
      getAllTestParameters().map(
        parameter => parameter.category
      )
    )
  ]
}


/**
 * Get all configured populations.
 *
 * @returns {Array}
 */
export function getReferencePopulations() {
  return REFERENCE_POPULATIONS
}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default TEST_PARAMETERS