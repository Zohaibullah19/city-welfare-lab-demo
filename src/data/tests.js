// ============================================================================
// INITIAL LABORATORY TEST CATALOG
//
// Prices + test parameters are based on the uploaded LABORATORY TEST MASTER
// LIST.
//
// IMPORTANT:
// The source document states that the listed reference ranges are commonly
// used adult ranges and may be method/analyzer dependent.
//
// Therefore:
// - Units and adult reference ranges are embedded where supplied.
// - Tests with method-specific interpretation are marked labSpecific.
// - We do NOT invent male/female/children ranges that are not present in the
//   supplied source.
// ============================================================================

let _id = 0

const nextId = () => `T${String(++_id).padStart(3, '0')}`

const parameter = (
  name,
  unit = '',
  referenceRange = '',
  options = {}
) => ({
  name,
  unit,
  referenceRange,
  labSpecific: !!options.labSpecific,
  notes: options.notes || ''
})

const test = (name, category, price, opts = {}) => ({
  id: nextId(),
  name,
  category,
  price,
  status: 'Active',
  needsVerification: !!opts.verify,
  note: opts.note || '',
  components: opts.components || []
})

export const SEED_TESTS = [

  // ==========================================================================
  // CHEMISTRY / PROFILES
  // ==========================================================================

  test('Lipid Profile', 'Chemistry', 1400, {
    components: [
      parameter('Total Cholesterol', 'mg/dL', '0–200'),
      parameter('Triglycerides', 'mg/dL', '0–150'),
      parameter('HDL', 'mg/dL', '40–60'),
      parameter('LDL', 'mg/dL', '0–100')
    ]
  }),

  test('RFTs', 'Chemistry', 1000, {
    components: [
      parameter('Urea', 'mg/dL', '15–45'),
      parameter('Creatinine', 'mg/dL', '0.6–1.3')
    ]
  }),

  test('LFTs', 'Chemistry', 1200, {
    components: [
      parameter('ALT / SGPT', 'U/L', '4–36'),
      parameter('ALP', 'U/L', '20–130'),
      parameter('Total Bilirubin', 'mg/dL', '0.1–1.2')
    ]
  }),

  test('ABGs', 'Chemistry', 2500, {
    components: [
      parameter('pH', '', '7.35–7.45'),
      parameter('PCO₂', 'mmHg', '35–45'),
      parameter('PO₂', 'mmHg', '80–100'),
      parameter('HCO₃', 'mmol/L', '22–26'),
      parameter('Base Excess / Deficit', 'mmol/L', '−2 to +2'),
      parameter('O₂ Saturation', '%', '95–100')
    ]
  }),

  test('Electrolytes', 'Chemistry', 2000, {
    components: [
      parameter('Sodium (Na⁺)', 'mmol/L', '135–145'),
      parameter('Potassium (K⁺)', 'mmol/L', '3.5–5.2'),
      parameter('Chloride (Cl⁻)', 'mmol/L', '98–107')
    ]
  }),

  test('HbA1c', 'Chemistry', 1200, {
    components: [
      parameter('HbA1c', '%', '<5.7')
    ]
  }),

  test('CRP', 'Chemistry', 1200, {
    components: [
      parameter('CRP', 'mg/L', '<3')
    ]
  }),

  test('Bilirubin Direct', 'Chemistry', 400, {
    components: [
      parameter('Direct Bilirubin', 'mg/dL', '<0.3')
    ]
  }),

  test('Bilirubin Indirect', 'Chemistry', 400, {
    components: [
      parameter('Indirect Bilirubin', 'mg/dL', '0.2–0.9')
    ]
  }),

  // ==========================================================================
  // INFECTIOUS DISEASE / SEROLOGY
  // ==========================================================================

  test('Malaria Parasite (MP)', 'Serology', 500, {
    components: [
      parameter('Malaria Parasite (MP)', '', 'Negative')
    ]
  }),

  test('Dengue NS1', 'Serology', 1000, {
    components: [
      parameter('Dengue NS1', '', 'Negative')
    ]
  }),

  test('Dengue IgG/IgM', 'Serology', 1000, {
    components: [
      parameter('Dengue IgG', '', 'Negative'),
      parameter('Dengue IgM', '', 'Negative')
    ]
  }),

  test('Typhoid IgG/IgM', 'Serology', 1000, {
    components: [
      parameter('Typhoid IgG', '', 'Negative'),
      parameter('Typhoid IgM', '', 'Negative')
    ]
  }),

  test('Widal TO/TI', 'Serology', 1000, {
    verify: true,
    note: 'Source lists Widal TO/TH. Reference interpretation is lab-specific.',
    components: [
      parameter(
        'Widal TO/TH',
        'Titer',
        'Lab-specific',
        {
          labSpecific: true,
          notes: 'Interpret according to laboratory kit/method.'
        }
      )
    ]
  }),

  test('HBs by ELISA', 'Serology', 3000, {
    components: [
      parameter(
        'HBsAg by ELISA',
        '',
        'Non-reactive',
        {
          labSpecific: true,
          notes: 'ELISA interpretation is method/kit dependent.'
        }
      )
    ]
  }),

  test('HCV by ELISA', 'Serology', 1500, {
    components: [
      parameter(
        'HCV by ELISA',
        '',
        'Non-reactive',
        {
          labSpecific: true,
          notes: 'ELISA interpretation is method/kit dependent.'
        }
      )
    ]
  }),

  test('HIV by ELISA', 'Serology', 3000, {
    components: [
      parameter(
        'HIV by ELISA',
        '',
        'Non-reactive',
        {
          labSpecific: true,
          notes: 'ELISA interpretation is method/kit dependent.'
        }
      )
    ]
  }),

  // ==========================================================================
  // MICROBIOLOGY
  // ==========================================================================

  test('Stool R/E', 'Microbiology', 500, {
    components: [
      parameter('Stool R/E', '', 'Normal findings')
    ]
  }),

  test('Urine Culture', 'Microbiology', 1600, {
    components: [
      parameter(
        'Urine Culture / C/S',
        '',
        'No growth',
        {
          labSpecific: true,
          notes: 'Culture interpretation depends on laboratory method.'
        }
      )
    ]
  }),

  test('Blood Culture', 'Microbiology', 2000, {
    components: [
      parameter(
        'Blood Culture / C/S',
        '',
        'No growth',
        {
          labSpecific: true,
          notes: 'Culture interpretation depends on laboratory method.'
        }
      )
    ]
  }),

  test('PCR', 'Microbiology', 4500, {
    components: [
      parameter(
        'PCR',
        '',
        'Not detected',
        {
          labSpecific: true,
          notes: 'PCR interpretation is assay-specific.'
        }
      )
    ]
  }),

  // ==========================================================================
  // CARDIAC
  // ==========================================================================

  test('Troponin-I', 'Cardiac', 1600, {
    components: [
      parameter(
        'Troponin-I',
        'ng/L or ng/mL',
        'Assay-specific',
        {
          labSpecific: true,
          notes: 'Reference value depends on assay/analyzer.'
        }
      )
    ]
  }),

  test('Troponin-T', 'Cardiac', 1600, {
    components: [
      parameter(
        'Troponin-T',
        'ng/L',
        'Assay-specific',
        {
          labSpecific: true,
          notes: 'Reference value depends on assay/analyzer.'
        }
      )
    ]
  }),

  test('CK-MB', 'Cardiac', 1600, {
    components: [
      parameter(
        'CK-MB',
        'ng/mL or U/L',
        'Assay-specific',
        {
          labSpecific: true,
          notes: 'Reference value depends on assay/analyzer.'
        }
      )
    ]
  }),

  // ==========================================================================
  // URINE / METABOLIC
  // ==========================================================================

  test('Ketone Blood', 'Chemistry', 1100, {
    components: [
      parameter('Blood Ketones', 'mmol/L', '<0.6')
    ]
  }),

  test('Ketone Urine', 'Chemistry', 150, {
    components: [
      parameter('Urine Ketones', '', 'Negative')
    ]
  }),

  // ==========================================================================
  // IMMUNOLOGY
  // ==========================================================================

  test('RA Factor', 'Immunology', 1000, {
    components: [
      parameter('RA Factor / Rheumatoid Factor', 'IU/mL', '<15')
    ]
  }),

  test('ASO Titer', 'Immunology', 8000, {
    components: [
      parameter('ASO Titer', 'IU/mL', '<200')
    ]
  }),

  test('ANA', 'Immunology', 1000, {
    components: [
      parameter(
        'ANA',
        '',
        'Negative',
        {
          labSpecific: true,
          notes: 'ANA interpretation depends on laboratory method.'
        }
      )
    ]
  }),

  // ==========================================================================
  // ADDITIONAL BIOCHEMISTRY
  // ==========================================================================

  test('Albumin', 'Chemistry', 500, {
    components: [
      parameter('Albumin', 'g/dL', '3.4–5.4')
    ]
  }),

  test('Total Bilirubin', 'Chemistry', 500, {
    components: [
      parameter('Total Bilirubin', 'mg/dL', '0.1–1.2')
    ]
  }),

  test('Direct Bilirubin', 'Chemistry', 400, {
    components: [
      parameter('Direct Bilirubin', 'mg/dL', '<0.3')
    ]
  }),

  test('Indirect Bilirubin', 'Chemistry', 400, {
    components: [
      parameter('Indirect Bilirubin', 'mg/dL', '0.2–0.9')
    ]
  }),

  // ==========================================================================
  // OTHER
  // ==========================================================================

  test('SBR', 'Chemistry', 500, {
    verify: true,
    note: 'Handwritten as SBR. Confirm whether this refers to total serum bilirubin.',
    components: [
      parameter(
        'SBR',
        'mg/dL',
        '0.1–1.2',
        {
          notes: 'Confirm exact laboratory definition before clinical use.'
        }
      )
    ]
  })
]

export const TEST_CATEGORIES = [
  ...new Set(SEED_TESTS.map(t => t.category))
]