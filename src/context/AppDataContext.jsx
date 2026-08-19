import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSettings } from '../services/storage'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [settings, setSettings] = useState(getSettings())
  const [refreshTick, setRefreshTick] = useState(0)

  const refreshSettings = useCallback(() => setSettings(getSettings()), [])
  const refreshAll = useCallback(() => setRefreshTick(t => t + 1), [])

  useEffect(() => {
    refreshSettings()
  }, [refreshTick, refreshSettings])

  return (
    <AppDataContext.Provider value={{ settings, refreshSettings, refreshAll, refreshTick }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
