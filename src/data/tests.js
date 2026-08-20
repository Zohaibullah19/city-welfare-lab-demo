// ============================================================================
// INITIAL LABORATORY TEST CATALOG
// Prices updated from the client's handwritten laboratory price list.
// ============================================================================

let _id = 0

const nextId = () => `T${String(++_id).padStart(3, '0')}`

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

  // --------------------------------------------------------------------------
  // CHEMISTRY / PROFILES
  // --------------------------------------------------------------------------

  test('Lipid Profile', 'Chemistry', 1400, {
    components: [
      'Triglycerides (TG)',
      'Cholesterol',
      'HDL',
      'LDL'
    ]
  }),

  test('RFTs', 'Chemistry', 1000, {
    components: [
      'Urea',
      'Creatinine'
    ]
  }),

  test('LFTs', 'Chemistry', 1200, {
    components: [
      'ALT',
      'ALP',
      'SBR'
    ]
  }),

  test('ABGs', 'Chemistry', 2500, {
    components: [
      'pH',
      'pCO₂',
      'pO₂',
      'HCO₃',
      'Base Excess / Deficit',
      'O₂ Saturation'
    ]
  }),

  test('Electrolytes', 'Chemistry', 2000, {
    components: [
      'Sodium (Na)',
      'Potassium (K)',
      'Chloride (Cl)'
    ]
  }),

  test('HbA1c', 'Chemistry', 1200),

  test('CRP', 'Chemistry', 1200),

  test('Bilirubin Direct', 'Chemistry', 400),

  test('Bilirubin Indirect', 'Chemistry', 400),

  // --------------------------------------------------------------------------
  // INFECTIOUS DISEASE / SEROLOGY
  // --------------------------------------------------------------------------

  test('Malaria Parasite (MP)', 'Serology', 500),

  test('Dengue NS1', 'Serology', 1000),

  test('Dengue IgG/IgM', 'Serology', 1000),

  test('Typhoid IgG/IgM', 'Serology', 1000),

  test('Widal TO/TI', 'Serology', 1000, {
    verify: true,
    note: 'Handwritten as Widal TO/TI. Confirm exact laboratory naming if required.'
  }),

  test('HBs by ELISA', 'Serology', 3000),

  test('HCV by ELISA', 'Serology', 1500),

  test('HIV by ELISA', 'Serology', 3000),

  // --------------------------------------------------------------------------
  // MICROBIOLOGY
  // --------------------------------------------------------------------------

  test('Stool R/E', 'Microbiology', 500),

  test('Urine Culture', 'Microbiology', 1600),

  test('Blood Culture', 'Microbiology', 2000),

  test('PCR', 'Microbiology', 4500),

  // --------------------------------------------------------------------------
  // CARDIAC
  // --------------------------------------------------------------------------

  test('Troponin-I', 'Cardiac', 1600),

  test('Troponin-T', 'Cardiac', 1600),

  // --------------------------------------------------------------------------
  // URINE / METABOLIC
  // --------------------------------------------------------------------------

  test('Ketone Blood', 'Chemistry', 1100),

  test('Ketone Urine', 'Chemistry', 150),

  // --------------------------------------------------------------------------
  // IMMUNOLOGY
  // --------------------------------------------------------------------------

  test('RA Factor', 'Immunology', 1000),

  test('ASO Titer', 'Immunology', 8000),

  test('ANA', 'Immunology', 1000),

  // --------------------------------------------------------------------------
  // OTHER
  // --------------------------------------------------------------------------

  test('SBR', 'Chemistry', 500, {
    verify: true,
    note: 'Handwritten as SBR. Confirm whether this refers to total serum bilirubin.'
  })
]

export const TEST_CATEGORIES = [
  ...new Set(SEED_TESTS.map(t => t.category))
]