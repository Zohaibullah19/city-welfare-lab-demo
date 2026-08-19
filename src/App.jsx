import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import PatientsList from './pages/Patients/PatientsList'
import RegisterPatient from './pages/Patients/RegisterPatient'
import PatientDetail from './pages/Patients/PatientDetail'
import TestOrders from './pages/TestOrders'
import TestCatalog from './pages/TestCatalog'
import { ResultsList, ResultEntry } from './pages/Results'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import PrintTestRequest from './pages/PrintTestRequest'
import PrintReport from './pages/PrintReport'
import { ToastProvider } from './context/ToastContext'
import { AppDataProvider } from './context/AppDataContext'
import { ensureSeeded } from './services/storage'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureSeeded()
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="loading-row" style={{ height: '100vh' }}>
        <span className="loading-spinner" /> Loading demo data…
      </div>
    )
  }

  return (
    <ToastProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Print routes render full-bleed, without the sidebar/header shell */}
            <Route path="/print/request/:orderId" element={<PrintTestRequest />} />
            <Route path="/print/report/:orderId" element={<PrintReport />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/patients/register" element={<RegisterPatient />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/orders" element={<TestOrders />} />
              <Route path="/catalog" element={<TestCatalog />} />
              <Route path="/results" element={<ResultsList />} />
              <Route path="/results/:orderId" element={<ResultEntry />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </ToastProvider>
  )
}
