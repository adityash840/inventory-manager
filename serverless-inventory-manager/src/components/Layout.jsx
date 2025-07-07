import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Analytics from '../pages/Analytics'

export default function Layout({ children }) {
  // Centralized dropdown state
  const [openDropdown, setOpenDropdown] = useState(null) // 'profile', 'analytics-listbox', 'notifications', or null
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Render Analytics with openDropdown prop */}
            {children.type === Analytics ? (
              <Analytics openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 