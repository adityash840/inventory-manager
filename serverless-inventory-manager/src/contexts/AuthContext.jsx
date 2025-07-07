import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLocation, useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = typeof window !== 'undefined' ? window.location : { pathname: '/' };
  // fallback for SSR or test
  const navigate = typeof window !== 'undefined' ? (path) => { window.location.href = path } : () => {};

  useEffect(() => {
    // Always sign out any existing session on app load
    const forceSignOut = async () => {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error signing out on app load:', error)
      } finally {
        setUser(null)
        setLoading(false)
      }
    }
    forceSignOut()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      console.log('Logout called')
      if (user && user.id !== 'demo-user') {
        await supabase.auth.signOut()
        console.log('Called supabase.auth.signOut()')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session after signOut:', session)
      }
      setUser(null)
      console.log('User set to null')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      setUser(null)
      window.location.href = '/login'
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 