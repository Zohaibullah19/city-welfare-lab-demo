// ============================================================================
// INITIAL DEMO TEST CATALOG
// Transcribed directly from the client's handwritten price list.
// Every price below was legible with reasonable confidence. A small number of
// test-NAME abbreviations were hard to read with certainty — those are
// flagged with needsVerification: true and listed again in README.md.
// Edit freely here, or use the Test Catalog page in the app (saved to
// localStorage, which then takes priority over this seed file).
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
  note: opts.note || ''
})

export const SEED_TESTS = [
  test('ABGs', 'Chemistry', 2500),
  test('Electrolytes', 'Chemistry', 1200),
  test('Lipid Profile', 'Chemistry', 1200),
  test('LFTs', 'Chemistry', 1000),
  test('RFTs', 'Chemistry', 1200),
  test('Calcium', 'Chemistry', 500),
  test('Uric Acid', 'Chemistry', 400),
  test('RBS', 'Chemistry', 300),
  test('Cardiac Profile', 'Chemistry', 1500),
  test('Lipase', 'Chemistry', 1500),
  test('Amylase', 'Chemistry', 1500),
  test('Urine R/E', 'Pathology', 300),
  test('SBR (D/Ind)', 'Chemistry', 1000, { verify: true, note: 'Handwritten as "SBR D/IND" — please confirm exact test name (e.g. Serum Bilirubin Direct/Indirect).' }),
  test('SBR', 'Chemistry', 500, { verify: true, note: 'Handwritten as "SBR" directly below "SBR D/IND" — please confirm this is a distinct test (e.g. Total Bilirubin) and not a duplicate entry.' }),
  test('ESR', 'Hematology', 300),
  test('NNP', 'Hematology', 500, { verify: true, note: 'Abbreviation was difficult to read clearly (could be "NNP" or "NPP") — please confirm full test name.' }),
  test('Blood Smear', 'Hematology', 1500),
  test('HBsAg', 'Serology', 400),
  test('HCV', 'Serology', 400),
  test('HIV', 'Serology', 500),
  test('PT/INR', 'Coagulation', 500),
  test('APTT', 'Coagulation', 500),
  test('Vitamin D', 'Hormone', 3000),
  test('Anti-CCP', 'Immunology', 3000),
  test('TSH', 'Hormone', 1500),
  test('FSH', 'Hormone', 1500),
  test('Prolactin', 'Hormone', 1500),
  test('TFTs', 'Hormone', 3000, { verify: true, note: 'Listed separately from TSH — please confirm "TFTs" (Thyroid Function Tests, a panel) is intentionally distinct from the single TSH test above.' }),
  test('AMH', 'Hormone', 6500),
  test('Semen Analysis', 'Pathology', 2000),
  test('Blood H. Pylori', 'Serology', 500),
  test('Stool H. Pylori', 'Serology', 1200),
  test('Blood Group', 'Immunohematology', 400),
  test('Blood Group + Cross Match', 'Immunohematology', 1200)
]

export const TEST_CATEGORIES = [...new Set(SEED_TESTS.map(t => t.category))]
