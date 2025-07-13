import { useState, useEffect, useRef } from 'react'
import { User, Moon, Sun, ChevronDown, Bell, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ openDropdown, setOpenDropdown }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const profileMenuRef = useRef(null)
  const notificationsMenuRef = useRef(null)
  const profileDropdownRef = useRef(null)
  const notificationsDropdownRef = useRef(null)
  const [profileDropdownPosition, setProfileDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()

  const displayName = user?.email ? user.email.split('@')[0] : 'Demo User'
  const displayEmail = user?.email || 'demo@example.com'
  const isDemoUser = user?.id === 'demo-user' || displayEmail === 'demo@example.com'

  // Fetch low stock notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, quantity')
        .lt('quantity', 10)
        .order('quantity', { ascending: true })
      if (!error) setNotifications(data || [])
    }
    fetchNotifications()
  }, [])

  // Simple Portal component
  function Portal({ children }) {
    if (typeof window === 'undefined') return null;
    const el = document.getElementById('dropdown-portal-root') || (() => {
      const el = document.createElement('div');
      el.id = 'dropdown-portal-root';
      document.body.appendChild(el);
      return el;
    })();
    return createPortal(children, el);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdown === 'profile') {
        if (
          profileDropdownRef.current &&
          !profileDropdownRef.current.contains(event.target)
        ) {
          setOpenDropdown(null)
        }
      } else if (openDropdown === 'notifications') {
        if (
          notificationsDropdownRef.current &&
          !notificationsDropdownRef.current.contains(event.target)
        ) {
          setOpenDropdown(null)
        }
      }
    }
    if (openDropdown === 'profile' || openDropdown === 'notifications') {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  // Handler to update profile dropdown position
  const handleProfileDropdownOpen = () => {
    if (profileDropdownRef.current) {
      const rect = profileDropdownRef.current.getBoundingClientRect();
      setProfileDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you'd implement dark mode logic here
  }

  return (
    <div className="flex h-20 items-center justify-between topbar px-8 bg-white/90 dark:bg-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, sales, customers..."
            className="pl-10 pr-4 py-2 w-80 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchValue.trim()) {
                navigate(`/inventory?search=${encodeURIComponent(searchValue.trim())}`)
              }
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsDropdownRef}>
          <button
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {openDropdown === 'notifications' && (
            <div ref={notificationsMenuRef} className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-300 text-sm">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <Bell className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Low stock: <span className="font-bold">{notif.name}</span></p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">Only {notif.quantity} left in stock</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        {/* User Menu */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => {
              if (openDropdown === 'profile') {
                setOpenDropdown(null)
              } else {
                setOpenDropdown('profile')
                setTimeout(handleProfileDropdownOpen, 0)
              }
            }}
            className="flex items-center space-x-3 p-2 rounded-lg transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 min-w-[220px]"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isDemoUser ? 'Demo User' : 'Administrator'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-200" />
          </button>
          
          {openDropdown === 'profile' && (
            <Portal>
              <div
                ref={profileMenuRef}
                style={{
                  position: 'absolute',
                  top: profileDropdownPosition.top,
                  left: profileDropdownPosition.left,
                  width: profileDropdownPosition.width,
                  zIndex: 9999
                }}
                className="w-64 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-100 break-all">
                    Signed in as <strong className="break-all">{displayEmail}</strong>
                  </p>
                </div>
                <div className="py-2">
                  <div className="border-t border-slate-100 my-2 dark:border-slate-700"></div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                    onMouseDown={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Sign Out button mouse down');
                      await logout();
                      navigate('/login');
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </Portal>
          )}
        </div>
      </div>
    </div>
  )
} 