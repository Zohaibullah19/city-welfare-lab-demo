// ============================================================================
// TEST PARAMETER MASTER DATA
//
// Units and reference/interpretation values are based on the supplied
// Laboratory Test Master List.
//
// IMPORTANT:
// The source document states that these are commonly used adult ranges and
// may be method/analyzer dependent. Therefore, we do not invent pediatric
// or gender-specific ranges.
//
// Reference profile structure is intentionally expandable:
//
// default
// male
// female
// child
// infant
// newborn
// custom
//
// Only values actually verified/configured should be added.
// ============================================================================

export const TEST_PARAMETER_LIBRARY = {

  // --------------------------------------------------------------------------
  // LIPID PROFILE
  // --------------------------------------------------------------------------

  'Lipid Profile': [
    {
      name: 'Total Cholesterol',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0–200'
      },
      resultType: 'number'
    },
    {
      name: 'Triglycerides',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0–150'
      },
      resultType: 'number'
    },
    {
      name: 'HDL',
      unit: 'mg/dL',
      referenceRanges: {
        default: '40–60'
      },
      resultType: 'number'
    },
    {
      name: 'LDL',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0–100'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // RFT
  // --------------------------------------------------------------------------

  'RFTs': [
    {
      name: 'Urea',
      unit: 'mg/dL',
      referenceRanges: {
        default: '15–45'
      },
      resultType: 'number'
    },
    {
      name: 'Creatinine',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0.6–1.3'
      },
      resultType: 'number'
    }
  ],

  'RFT': [
    {
      name: 'Urea',
      unit: 'mg/dL',
      referenceRanges: {
        default: '15–45'
      },
      resultType: 'number'
    },
    {
      name: 'Creatinine',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0.6–1.3'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // LFT
  // --------------------------------------------------------------------------

  'LFTs': [
    {
      name: 'ALT / SGPT',
      unit: 'U/L',
      referenceRanges: {
        default: '4–36'
      },
      resultType: 'number'
    },
    {
      name: 'ALP',
      unit: 'U/L',
      referenceRanges: {
        default: '20–130'
      },
      resultType: 'number'
    },
    {
      name: 'Total Bilirubin',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0.1–1.2'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // ABGs
  // --------------------------------------------------------------------------

  'ABGs': [
    {
      name: 'pH',
      unit: '—',
      referenceRanges: {
        default: '7.35–7.45'
      },
      resultType: 'number'
    },
    {
      name: 'PCO₂',
      unit: 'mmHg',
      referenceRanges: {
        default: '35–45'
      },
      resultType: 'number'
    },
    {
      name: 'PO₂',
      unit: 'mmHg',
      referenceRanges: {
        default: '80–100'
      },
      resultType: 'number'
    },
    {
      name: 'HCO₃',
      unit: 'mmol/L',
      referenceRanges: {
        default: '22–26'
      },
      resultType: 'number'
    },
    {
      name: 'Base Excess / Deficit',
      unit: 'mmol/L',
      referenceRanges: {
        default: '−2 to +2'
      },
      resultType: 'number'
    },
    {
      name: 'O₂ Saturation',
      unit: '%',
      referenceRanges: {
        default: '95–100'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // ELECTROLYTES
  // --------------------------------------------------------------------------

  'Electrolytes': [
    {
      name: 'Sodium (Na⁺)',
      unit: 'mmol/L',
      referenceRanges: {
        default: '135–145'
      },
      resultType: 'number'
    },
    {
      name: 'Potassium (K⁺)',
      unit: 'mmol/L',
      referenceRanges: {
        default: '3.5–5.2'
      },
      resultType: 'number'
    },
    {
      name: 'Chloride (Cl⁻)',
      unit: 'mmol/L',
      referenceRanges: {
        default: '98–107'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // INFECTIOUS / SEROLOGY
  // --------------------------------------------------------------------------

  'Malaria Parasite (MP)': [
    {
      name: 'Malaria Parasite (MP)',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Dengue NS1': [
    {
      name: 'Dengue NS1',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Dengue IgG': [
    {
      name: 'Dengue IgG',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Dengue IgM': [
    {
      name: 'Dengue IgM',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Typhoid IgG': [
    {
      name: 'Typhoid IgG',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Typhoid IgM': [
    {
      name: 'Typhoid IgM',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'Widal TO/TH Titer': [
    {
      name: 'Widal TO/TH Titer',
      unit: '—',
      referenceRanges: {
        default: 'Lab-specific'
      },
      resultType: 'text'
    }
  ],

  'HBsAg by ELISA': [
    {
      name: 'HBsAg by ELISA',
      unit: '—',
      referenceRanges: {
        default: 'Non-reactive'
      },
      resultType: 'select',
      options: ['Non-reactive', 'Reactive']
    }
  ],

  'HCV by ELISA': [
    {
      name: 'HCV by ELISA',
      unit: '—',
      referenceRanges: {
        default: 'Non-reactive'
      },
      resultType: 'select',
      options: ['Non-reactive', 'Reactive']
    }
  ],

  'HIV by ELISA': [
    {
      name: 'HIV by ELISA',
      unit: '—',
      referenceRanges: {
        default: 'Non-reactive'
      },
      resultType: 'select',
      options: ['Non-reactive', 'Reactive']
    }
  ],

  // --------------------------------------------------------------------------
  // OTHER LABORATORY
  // --------------------------------------------------------------------------

  'HbA1c': [
    {
      name: 'HbA1c',
      unit: '%',
      referenceRanges: {
        default: '<5.7'
      },
      resultType: 'number'
    }
  ],

  'Stool R/E': [
    {
      name: 'Stool R/E',
      unit: '—',
      referenceRanges: {
        default: 'Normal findings'
      },
      resultType: 'text'
    }
  ],

  'Urine Culture / C/S': [
    {
      name: 'Urine Culture / C/S',
      unit: '—',
      referenceRanges: {
        default: 'No growth'
      },
      resultType: 'text'
    }
  ],

  'Blood Culture / C/S': [
    {
      name: 'Blood Culture / C/S',
      unit: '—',
      referenceRanges: {
        default: 'No growth'
      },
      resultType: 'text'
    }
  ],

  'PCR': [
    {
      name: 'PCR',
      unit: '—',
      referenceRanges: {
        default: 'Not detected'
      },
      resultType: 'select',
      options: ['Not detected', 'Detected']
    }
  ],

  'Blood Ketones': [
    {
      name: 'Blood Ketones',
      unit: 'mmol/L',
      referenceRanges: {
        default: '<0.6'
      },
      resultType: 'number'
    }
  ],

  'Urine Ketones': [
    {
      name: 'Urine Ketones',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'RA Factor / Rheumatoid Factor': [
    {
      name: 'RA Factor / Rheumatoid Factor',
      unit: 'IU/mL',
      referenceRanges: {
        default: '<15'
      },
      resultType: 'number'
    }
  ],

  'ASO Titer': [
    {
      name: 'ASO Titer',
      unit: 'IU/mL',
      referenceRanges: {
        default: '<200'
      },
      resultType: 'number'
    }
  ],

  'ANA': [
    {
      name: 'ANA',
      unit: '—',
      referenceRanges: {
        default: 'Negative'
      },
      resultType: 'select',
      options: ['Negative', 'Positive']
    }
  ],

  'CRP': [
    {
      name: 'CRP',
      unit: 'mg/L',
      referenceRanges: {
        default: '<3'
      },
      resultType: 'number'
    }
  ],

  // --------------------------------------------------------------------------
  // CARDIAC
  // --------------------------------------------------------------------------

  'Troponin-I': [
    {
      name: 'Troponin-I',
      unit: 'ng/L or ng/mL',
      referenceRanges: {
        default: 'Assay-specific'
      },
      resultType: 'text'
    }
  ],

  'Troponin-T': [
    {
      name: 'Troponin-T',
      unit: 'ng/L',
      referenceRanges: {
        default: 'Assay-specific'
      },
      resultType: 'text'
    }
  ],

  'CK-MB': [
    {
      name: 'CK-MB',
      unit: 'ng/mL or U/L',
      referenceRanges: {
        default: 'Assay-specific'
      },
      resultType: 'text'
    }
  ],

  // --------------------------------------------------------------------------
  // ADDITIONAL BIOCHEMISTRY
  // --------------------------------------------------------------------------

  'Albumin': [
    {
      name: 'Albumin',
      unit: 'g/dL',
      referenceRanges: {
        default: '3.4–5.4'
      },
      resultType: 'number'
    }
  ],

  'Total Bilirubin': [
    {
      name: 'Total Bilirubin',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0.1–1.2'
      },
      resultType: 'number'
    }
  ],

  'Direct Bilirubin': [
    {
      name: 'Direct Bilirubin',
      unit: 'mg/dL',
      referenceRanges: {
        default: '<0.3'
      },
      resultType: 'number'
    }
  ],

  'Indirect Bilirubin': [
    {
      name: 'Indirect Bilirubin',
      unit: 'mg/dL',
      referenceRanges: {
        default: '0.2–0.9'
      },
      resultType: 'number'
    }
  ]
}

export function getTestParameters(testName) {
  return TEST_PARAMETER_LIBRARY[testName] || []
}