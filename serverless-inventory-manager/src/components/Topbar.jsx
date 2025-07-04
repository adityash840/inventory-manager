import { useState } from 'react'
import { User, Moon, Sun, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Topbar() {
  const { user } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you'd implement dark mode logic here
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-medium text-gray-700">
              {user?.email || 'User'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2 text-sm text-gray-700">
                Signed in as <strong>{user?.email}</strong>
              </div>
              <div className="border-t border-gray-100">
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 