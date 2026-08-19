// ============================================================================
// LABORATORY IDENTITY — single source of truth.
// Change the laboratory name, address, phone, technologists, or logo path
// here and it updates everywhere in the app (sidebar, header, print pages,
// settings). Defaults below are overridden by anything saved in
// localStorage via the Settings page (see services/storage.js -> getSettings).
// ============================================================================

export const DEFAULT_LAB_INFO = {
  name: 'CITY WELFARE MEDICAL LABORATORY',
  subtitle: 'City Medical Center Peshawar',
  address: 'City Medical Center Near Lady Reading Hospital Peshawar.',
  phone: '0300-0000000', // PLACEHOLDER — edit in Settings, real number not on the reference form
  // To replace the logo: drop your file into /public/logo/ and update this path,
  // or use the "Upload Logo" control on the Settings page (stored as a data URL).
  logoPath: '/logo/logo.svg',
  technologists: [
    {
      name: 'BASHIR AHMAD',
      title: 'Laboratory Technologist',
      qualification: 'BS MLT',
      institute: 'Gomal University D.I Khan'
    },
    {
      name: 'ASAD ULLAH',
      title: 'Laboratory Technologist',
      qualification: 'BS MLT',
      institute: 'Gomal University D.I Khan'
    }
  ]
}
