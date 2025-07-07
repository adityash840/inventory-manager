import { createContext, useContext, useState } from 'react'

const DataStatusContext = createContext({ isDemo: true, setIsDemo: () => {} })

export function DataStatusProvider({ children }) {
  const [isDemo, setIsDemo] = useState(true)
  return (
    <DataStatusContext.Provider value={{ isDemo, setIsDemo }}>
      {children}
    </DataStatusContext.Provider>
  )
}

export function useDataStatus() {
  const context = useContext(DataStatusContext)
  if (!context) throw new Error('useDataStatus must be used within a DataStatusProvider')
  return context
} 